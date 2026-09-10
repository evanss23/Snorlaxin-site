import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import bcrypt from "bcryptjs";

export const DATA_DIR = path.resolve(process.env.DATA_DIR ?? "./data");
export const UPLOAD_DIR = path.join(DATA_DIR, "uploads");

const globalForDb = globalThis as unknown as { __snorlaxinDb?: Database.Database };

function initialise(db: Database.Database) {
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'team',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      price_cents INTEGER NOT NULL,
      category TEXT NOT NULL DEFAULT 'Other',
      image_path TEXT,
      stock INTEGER NOT NULL DEFAULT 0,
      featured INTEGER NOT NULL DEFAULT 0,
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS gallery_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      path TEXT NOT NULL,
      caption TEXT NOT NULL DEFAULT '',
      uploaded_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS custom_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      product_type TEXT NOT NULL,
      size TEXT NOT NULL,
      notes TEXT NOT NULL DEFAULT '',
      images TEXT NOT NULL DEFAULT '[]',
      status TEXT NOT NULL DEFAULT 'new',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT NOT NULL,
      email TEXT NOT NULL,
      address TEXT NOT NULL,
      notes TEXT NOT NULL DEFAULT '',
      items TEXT NOT NULL,
      total_cents INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  seedAdmin(db);
  seedDemoProducts(db);
}

function seedAdmin(db: Database.Database) {
  const count = db.prepare("SELECT COUNT(*) AS c FROM users").get() as { c: number };
  if (count.c > 0) return;
  const email = (process.env.ADMIN_EMAIL ?? "admin@snorlaxin.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "snorlax123";
  const name = process.env.ADMIN_NAME ?? "Snorlaxin Team";
  db.prepare("INSERT INTO users (email, name, password_hash, role) VALUES (?, ?, ?, 'admin')").run(
    email,
    name,
    bcrypt.hashSync(password, 10),
  );
}

function seedDemoProducts(db: Database.Database) {
  const count = db.prepare("SELECT COUNT(*) AS c FROM products").get() as { c: number };
  if (count.c > 0) return;
  const insert = db.prepare(
    `INSERT INTO products (slug, name, description, price_cents, category, image_path, stock, featured)
     VALUES (@slug, @name, @description, @price_cents, @category, @image_path, @stock, @featured)`,
  );
  const demo = [
    {
      slug: "sleepy-snorlax-plush",
      name: "Sleepy Snorlax Plush",
      description:
        "An extra-squishy 12\" Snorlax plush that is perfectly content to nap on your shelf, desk, or pillow. Soft minky fabric with embroidered details.",
      price_cents: 3499,
      category: "Plush",
      image_path: "/demo/plush.svg",
      stock: 24,
      featured: 1,
    },
    {
      slug: "zzz-embroidered-hoodie",
      name: "Zzz Embroidered Hoodie",
      description:
        "Heavyweight teal hoodie with a tiny embroidered sleeping Snorlax on the chest and a big 'Zzz' across the back. Pre-shrunk and unbelievably cosy.",
      price_cents: 5900,
      category: "Apparel",
      image_path: "/demo/hoodie.svg",
      stock: 40,
      featured: 1,
    },
    {
      slug: "nap-time-enamel-pin-set",
      name: "Nap Time Enamel Pin Set",
      description:
        "Three hard-enamel pins: a snoring Snorlax, a floating Zzz, and a half-eaten berry. Double posts with rubber clutches.",
      price_cents: 1800,
      category: "Pins & Keychains",
      image_path: "/demo/pins.svg",
      stock: 120,
      featured: 1,
    },
    {
      slug: "resin-pokeball-coaster-set",
      name: "Resin Poké Ball Coaster Set",
      description:
        "A set of four hand-poured epoxy coasters with swirls of teal and cream and a cork backing. Each set is one of a kind.",
      price_cents: 4200,
      category: "Epoxy",
      image_path: "/demo/coasters.svg",
      stock: 10,
      featured: 1,
    },
    {
      slug: "snorlax-tufted-rug",
      name: "Snorlax Tufted Rug",
      description:
        "A 30\" hand-tufted Snorlax rug with a plush pile that is almost as nap-friendly as the real thing. Non-slip backing.",
      price_cents: 12900,
      category: "Rugs",
      image_path: "/demo/rug.svg",
      stock: 4,
      featured: 1,
    },
    {
      slug: "dreamy-berry-sticker-pack",
      name: "Dreamy Berry Sticker Pack",
      description:
        "Ten weatherproof vinyl stickers featuring Snorlax and friends dreaming about snacks. Dishwasher safe and fade-resistant.",
      price_cents: 900,
      category: "Other",
      image_path: "/demo/stickers.svg",
      stock: 200,
      featured: 0,
    },
  ];
  const tx = db.transaction(() => demo.forEach((p) => insert.run(p)));
  tx();
}

export function getDb(): Database.Database {
  if (globalForDb.__snorlaxinDb) return globalForDb.__snorlaxinDb;
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  const db = new Database(path.join(DATA_DIR, "snorlaxin.db"));
  initialise(db);
  globalForDb.__snorlaxinDb = db;
  return db;
}
