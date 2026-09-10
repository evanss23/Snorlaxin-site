import fs from "node:fs";
import path from "node:path";
import { UPLOAD_DIR } from "@/lib/db";

const TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
};

export async function GET(_req: Request, ctx: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await ctx.params;
  const target = path.resolve(UPLOAD_DIR, ...segments);
  if (!target.startsWith(UPLOAD_DIR)) return new Response("Not found", { status: 404 });

  let stat: fs.Stats;
  try {
    stat = await fs.promises.stat(target);
  } catch {
    return new Response("Not found", { status: 404 });
  }
  if (!stat.isFile()) return new Response("Not found", { status: 404 });

  const type = TYPES[path.extname(target).toLowerCase()] ?? "application/octet-stream";
  const data = await fs.promises.readFile(target);
  return new Response(new Uint8Array(data), {
    headers: {
      "Content-Type": type,
      "Content-Length": String(stat.size),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
