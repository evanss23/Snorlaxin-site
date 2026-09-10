"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { deleteImage, saveImage, UploadError } from "@/lib/uploads";
import { CUSTOM_SIZES, CUSTOM_TYPES, REQUEST_STATUSES, type CustomRequest } from "@/lib/types";

export interface RequestState {
  error?: string;
  success?: { id: number; name: string };
}

const schema = z.object({
  name: z.string().trim().min(2, "Tell us your name.").max(120),
  email: z.string().trim().email("Enter a valid email so we can reply."),
  product_type: z.enum(CUSTOM_TYPES.map((t) => t.value) as [string, ...string[]], {
    message: "Pick what you'd like us to make.",
  }),
  size: z.enum(CUSTOM_SIZES.map((s) => s.value) as [string, ...string[]], { message: "Choose a size." }),
  notes: z.string().trim().max(3000).default(""),
});

export async function submitRequestAction(_prev: RequestState, formData: FormData): Promise<RequestState> {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    product_type: formData.get("product_type"),
    size: formData.get("size"),
    notes: formData.get("notes") ?? "",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the form." };

  const files = formData.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length === 0) return { error: "Add at least one reference image so we know what to make." };
  if (files.length > 6) return { error: "You can attach up to 6 images." };

  const paths: string[] = [];
  try {
    for (const file of files) paths.push(await saveImage(file, "requests"));
  } catch (e) {
    await Promise.all(paths.map(deleteImage));
    return { error: e instanceof UploadError ? e.message : "Couldn't save your images. Please try again." };
  }

  const d = parsed.data;
  const result = getDb()
    .prepare(
      `INSERT INTO custom_requests (name, email, product_type, size, notes, images) VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .run(d.name, d.email.toLowerCase(), d.product_type, d.size, d.notes, JSON.stringify(paths));

  revalidatePath("/admin");
  revalidatePath("/admin/requests");
  return { success: { id: Number(result.lastInsertRowid), name: d.name } };
}

export async function updateRequestStatusAction(formData: FormData) {
  await requireUser();
  const id = Number(formData.get("id"));
  const status = String(formData.get("status"));
  if (!(REQUEST_STATUSES as readonly string[]).includes(status)) return;
  getDb().prepare("UPDATE custom_requests SET status = ? WHERE id = ?").run(status, id);
  revalidatePath("/admin");
  revalidatePath("/admin/requests");
}

export async function deleteRequestAction(formData: FormData) {
  await requireUser();
  const id = Number(formData.get("id"));
  const db = getDb();
  const row = db.prepare("SELECT * FROM custom_requests WHERE id = ?").get(id) as
    | (Omit<CustomRequest, "images"> & { images: string })
    | undefined;
  if (row) {
    const images = JSON.parse(row.images) as string[];
    await Promise.all(images.map(deleteImage));
    db.prepare("DELETE FROM custom_requests WHERE id = ?").run(id);
  }
  revalidatePath("/admin");
  revalidatePath("/admin/requests");
}
