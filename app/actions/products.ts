"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { deleteImage, saveImage, UploadError } from "@/lib/uploads";
import { slugify } from "@/lib/format";
import { PRODUCT_CATEGORIES, type Product } from "@/lib/types";
import type { ActionState } from "./auth";

const productSchema = z.object({
  name: z.string().trim().min(2, "Give the product a name.").max(120),
  description: z.string().trim().max(4000).default(""),
  price: z.coerce.number().min(0, "Price can't be negative.").max(100000),
  category: z.enum(PRODUCT_CATEGORIES),
  stock: z.coerce.number().int().min(0).max(100000).default(0),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
});

function parseProduct(formData: FormData) {
  return productSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") ?? "",
    price: formData.get("price"),
    category: formData.get("category"),
    stock: formData.get("stock") ?? 0,
    featured: formData.get("featured") === "on",
    active: formData.get("active") === "on",
  });
}

function uniqueSlug(base: string, excludeId?: number) {
  const db = getDb();
  let slug = base || "product";
  let i = 2;
  while (true) {
    const row = db.prepare("SELECT id FROM products WHERE slug = ?").get(slug) as { id: number } | undefined;
    if (!row || row.id === excludeId) return slug;
    slug = `${base}-${i++}`;
  }
}

function revalidateProducts() {
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/products");
}

export async function createProductAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireUser();
  const parsed = parseProduct(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the form." };

  let imagePath: string | null = null;
  const file = formData.get("image");
  if (file instanceof File && file.size > 0) {
    try {
      imagePath = await saveImage(file, "products");
    } catch (e) {
      return { error: e instanceof UploadError ? e.message : "Couldn't save the image." };
    }
  }

  const d = parsed.data;
  const slug = uniqueSlug(slugify(d.name));
  getDb()
    .prepare(
      `INSERT INTO products (slug, name, description, price_cents, category, image_path, stock, featured, active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(slug, d.name, d.description, Math.round(d.price * 100), d.category, imagePath, d.stock, d.featured ? 1 : 0, d.active ? 1 : 0);

  revalidateProducts();
  redirect("/admin/products?created=1");
}

export async function updateProductAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireUser();
  const id = Number(formData.get("id"));
  const db = getDb();
  const existing = db.prepare("SELECT * FROM products WHERE id = ?").get(id) as Product | undefined;
  if (!existing) return { error: "Product not found." };

  const parsed = parseProduct(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the form." };

  let imagePath = existing.image_path;
  const file = formData.get("image");
  if (file instanceof File && file.size > 0) {
    try {
      imagePath = await saveImage(file, "products");
      await deleteImage(existing.image_path);
    } catch (e) {
      return { error: e instanceof UploadError ? e.message : "Couldn't save the image." };
    }
  } else if (formData.get("remove_image") === "on") {
    await deleteImage(existing.image_path);
    imagePath = null;
  }

  const d = parsed.data;
  const slug = d.name !== existing.name ? uniqueSlug(slugify(d.name), id) : existing.slug;
  db.prepare(
    `UPDATE products SET slug = ?, name = ?, description = ?, price_cents = ?, category = ?, image_path = ?, stock = ?, featured = ?, active = ?
     WHERE id = ?`,
  ).run(slug, d.name, d.description, Math.round(d.price * 100), d.category, imagePath, d.stock, d.featured ? 1 : 0, d.active ? 1 : 0, id);

  revalidateProducts();
  revalidatePath(`/shop/${existing.slug}`);
  revalidatePath(`/shop/${slug}`);
  return { success: "Saved! Your changes are live." };
}

export async function deleteProductAction(formData: FormData) {
  await requireUser();
  const id = Number(formData.get("id"));
  const db = getDb();
  const existing = db.prepare("SELECT * FROM products WHERE id = ?").get(id) as Product | undefined;
  if (existing) {
    await deleteImage(existing.image_path);
    db.prepare("DELETE FROM products WHERE id = ?").run(id);
  }
  revalidateProducts();
}

export async function toggleProductAction(formData: FormData) {
  await requireUser();
  const id = Number(formData.get("id"));
  const field = formData.get("field") === "featured" ? "featured" : "active";
  getDb().prepare(`UPDATE products SET ${field} = CASE WHEN ${field} = 1 THEN 0 ELSE 1 END WHERE id = ?`).run(id);
  revalidateProducts();
}
