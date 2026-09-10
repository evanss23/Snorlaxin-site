import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { UPLOAD_DIR } from "./db";

const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

export class UploadError extends Error {}

/**
 * Persist an uploaded image to the data directory and return the public URL
 * (served by /uploads/[...path]).
 */
export async function saveImage(file: File, folder: string): Promise<string> {
  if (!(file instanceof File) || file.size === 0) throw new UploadError("No file provided.");
  const ext = ALLOWED[file.type];
  if (!ext) throw new UploadError("Only JPG, PNG, WEBP, GIF and AVIF images are allowed.");
  if (file.size > MAX_UPLOAD_BYTES) throw new UploadError("Images must be 8 MB or smaller.");

  const safeFolder = folder.replace(/[^a-z0-9_-]/gi, "");
  const dir = path.join(UPLOAD_DIR, safeFolder);
  await fs.mkdir(dir, { recursive: true });
  const name = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}.${ext}`;
  await fs.writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${safeFolder}/${name}`;
}

export async function deleteImage(publicPath: string | null | undefined) {
  if (!publicPath || !publicPath.startsWith("/uploads/")) return;
  const rel = publicPath.slice("/uploads/".length);
  const target = path.resolve(UPLOAD_DIR, rel);
  if (!target.startsWith(UPLOAD_DIR)) return;
  await fs.rm(target, { force: true });
}
