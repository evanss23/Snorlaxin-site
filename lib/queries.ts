import "server-only";
import { getDb } from "./db";
import type { CustomRequest, GalleryImage, Order, Product, User } from "./types";

export function listProducts(opts: { category?: string; q?: string; includeInactive?: boolean } = {}): Product[] {
  const where: string[] = [];
  const params: unknown[] = [];
  if (!opts.includeInactive) where.push("active = 1");
  if (opts.category) {
    where.push("category = ?");
    params.push(opts.category);
  }
  if (opts.q) {
    where.push("(name LIKE ? OR description LIKE ?)");
    params.push(`%${opts.q}%`, `%${opts.q}%`);
  }
  const sql = `SELECT * FROM products ${where.length ? "WHERE " + where.join(" AND ") : ""} ORDER BY featured DESC, created_at DESC, id DESC`;
  return getDb().prepare(sql).all(...params) as Product[];
}

export function featuredProducts(limit = 4): Product[] {
  return getDb()
    .prepare("SELECT * FROM products WHERE active = 1 ORDER BY featured DESC, created_at DESC LIMIT ?")
    .all(limit) as Product[];
}

export function getProductBySlug(slug: string): Product | null {
  return (getDb().prepare("SELECT * FROM products WHERE slug = ?").get(slug) as Product | undefined) ?? null;
}

export function getProductById(id: number): Product | null {
  return (getDb().prepare("SELECT * FROM products WHERE id = ?").get(id) as Product | undefined) ?? null;
}

export function relatedProducts(product: Product, limit = 4): Product[] {
  return getDb()
    .prepare(
      "SELECT * FROM products WHERE active = 1 AND id != ? ORDER BY (category = ?) DESC, featured DESC, RANDOM() LIMIT ?",
    )
    .all(product.id, product.category, limit) as Product[];
}

export function productCategories(): string[] {
  return (getDb().prepare("SELECT DISTINCT category FROM products WHERE active = 1 ORDER BY category").all() as { category: string }[]).map(
    (r) => r.category,
  );
}

export function listGallery(limit?: number): GalleryImage[] {
  const sql = `SELECT g.*, u.name AS uploader_name FROM gallery_images g LEFT JOIN users u ON u.id = g.uploaded_by ORDER BY g.created_at DESC, g.id DESC ${
    limit ? "LIMIT " + Number(limit) : ""
  }`;
  return getDb().prepare(sql).all() as GalleryImage[];
}

export function listRequests(status?: string): CustomRequest[] {
  const rows = (
    status
      ? getDb().prepare("SELECT * FROM custom_requests WHERE status = ? ORDER BY created_at DESC, id DESC").all(status)
      : getDb().prepare("SELECT * FROM custom_requests ORDER BY created_at DESC, id DESC").all()
  ) as (Omit<CustomRequest, "images"> & { images: string })[];
  return rows.map((r) => ({ ...r, images: JSON.parse(r.images) as string[] }));
}

export function listOrders(): Order[] {
  const rows = getDb().prepare("SELECT * FROM orders ORDER BY created_at DESC, id DESC").all() as (Omit<Order, "items"> & {
    items: string;
  })[];
  return rows.map((r) => ({ ...r, items: JSON.parse(r.items) }));
}

export function getOrder(id: number): Order | null {
  const row = getDb().prepare("SELECT * FROM orders WHERE id = ?").get(id) as (Omit<Order, "items"> & { items: string }) | undefined;
  return row ? { ...row, items: JSON.parse(row.items) } : null;
}

export function listUsers(): User[] {
  return getDb().prepare("SELECT id, email, name, role, created_at FROM users ORDER BY created_at").all() as User[];
}

export function dashboardStats() {
  const db = getDb();
  const one = (sql: string) => (db.prepare(sql).get() as { c: number }).c;
  return {
    products: one("SELECT COUNT(*) AS c FROM products"),
    activeProducts: one("SELECT COUNT(*) AS c FROM products WHERE active = 1"),
    gallery: one("SELECT COUNT(*) AS c FROM gallery_images"),
    newRequests: one("SELECT COUNT(*) AS c FROM custom_requests WHERE status = 'new'"),
    requests: one("SELECT COUNT(*) AS c FROM custom_requests"),
    pendingOrders: one("SELECT COUNT(*) AS c FROM orders WHERE status = 'pending'"),
    orders: one("SELECT COUNT(*) AS c FROM orders"),
    revenue: (db.prepare("SELECT COALESCE(SUM(total_cents),0) AS s FROM orders WHERE status != 'cancelled'").get() as { s: number }).s,
    lowStock: one("SELECT COUNT(*) AS c FROM products WHERE active = 1 AND stock <= 3"),
  };
}
