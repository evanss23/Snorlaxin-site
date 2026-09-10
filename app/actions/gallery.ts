"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { deleteImage, saveImage, UploadError } from "@/lib/uploads";
import type { ActionState } from "./auth";
import type { GalleryImage } from "@/lib/types";

export async function uploadGalleryAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  const files = formData.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);
  const caption = String(formData.get("caption") ?? "").trim().slice(0, 200);
  if (files.length === 0) return { error: "Choose at least one image to upload." };
  if (files.length > 20) return { error: "Upload up to 20 images at a time." };

  const db = getDb();
  const insert = db.prepare("INSERT INTO gallery_images (path, caption, uploaded_by) VALUES (?, ?, ?)");
  let saved = 0;
  try {
    for (const file of files) {
      const path = await saveImage(file, "gallery");
      insert.run(path, caption, user.id);
      saved++;
    }
  } catch (e) {
    if (saved === 0) return { error: e instanceof UploadError ? e.message : "Couldn't save the images." };
  }

  revalidatePath("/gallery");
  revalidatePath("/");
  revalidatePath("/admin/gallery");
  return { success: `${saved} image${saved === 1 ? "" : "s"} added to the gallery.` };
}

export async function updateCaptionAction(formData: FormData) {
  await requireUser();
  const id = Number(formData.get("id"));
  const caption = String(formData.get("caption") ?? "").trim().slice(0, 200);
  getDb().prepare("UPDATE gallery_images SET caption = ? WHERE id = ?").run(caption, id);
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
}

export async function deleteGalleryAction(formData: FormData) {
  await requireUser();
  const id = Number(formData.get("id"));
  const db = getDb();
  const row = db.prepare("SELECT * FROM gallery_images WHERE id = ?").get(id) as GalleryImage | undefined;
  if (row) {
    await deleteImage(row.path);
    db.prepare("DELETE FROM gallery_images WHERE id = ?").run(id);
  }
  revalidatePath("/gallery");
  revalidatePath("/");
  revalidatePath("/admin/gallery");
}
