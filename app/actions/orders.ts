"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { ORDER_STATUSES, type OrderItem, type Product } from "@/lib/types";

export interface OrderState {
  error?: string;
  orderId?: number;
}

const schema = z.object({
  customer_name: z.string().trim().min(2, "Enter your name.").max(120),
  email: z.string().trim().email("Enter a valid email."),
  address: z.string().trim().min(8, "Enter a full shipping address.").max(600),
  notes: z.string().trim().max(1000).default(""),
  items: z
    .array(z.object({ product_id: z.number().int(), quantity: z.number().int().min(1).max(99) }))
    .min(1, "Your cart is empty."),
});

export async function placeOrderAction(_prev: OrderState, formData: FormData): Promise<OrderState> {
  let items: unknown = [];
  try {
    items = JSON.parse(String(formData.get("items") ?? "[]"));
  } catch {
    return { error: "Your cart couldn't be read. Please refresh and try again." };
  }
  const parsed = schema.safeParse({
    customer_name: formData.get("customer_name"),
    email: formData.get("email"),
    address: formData.get("address"),
    notes: formData.get("notes") ?? "",
    items,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the form." };

  const db = getDb();
  const getProduct = db.prepare("SELECT * FROM products WHERE id = ? AND active = 1");
  const lineItems: OrderItem[] = [];
  for (const line of parsed.data.items) {
    const p = getProduct.get(line.product_id) as Product | undefined;
    if (!p) return { error: "One of the items in your cart is no longer available." };
    if (p.stock < line.quantity) return { error: `Only ${p.stock} of "${p.name}" left in stock.` };
    lineItems.push({
      product_id: p.id,
      name: p.name,
      price_cents: p.price_cents,
      quantity: line.quantity,
      image_path: p.image_path,
    });
  }
  const total = lineItems.reduce((n, i) => n + i.price_cents * i.quantity, 0);

  const d = parsed.data;
  const orderId = db.transaction(() => {
    const res = db
      .prepare(
        `INSERT INTO orders (customer_name, email, address, notes, items, total_cents) VALUES (?, ?, ?, ?, ?, ?)`,
      )
      .run(d.customer_name, d.email.toLowerCase(), d.address, d.notes, JSON.stringify(lineItems), total);
    const dec = db.prepare("UPDATE products SET stock = stock - ? WHERE id = ?");
    for (const li of lineItems) dec.run(li.quantity, li.product_id);
    return Number(res.lastInsertRowid);
  })();

  revalidatePath("/shop");
  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  return { orderId };
}

export async function updateOrderStatusAction(formData: FormData) {
  await requireUser();
  const id = Number(formData.get("id"));
  const status = String(formData.get("status"));
  if (!(ORDER_STATUSES as readonly string[]).includes(status)) return;
  getDb().prepare("UPDATE orders SET status = ? WHERE id = ?").run(status, id);
  revalidatePath("/admin");
  revalidatePath("/admin/orders");
}
