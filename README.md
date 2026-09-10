# Snorlaxin

A cosy Pokémon merch store with a Snorlax colour theme. Built with Next.js 15, React 19, Tailwind CSS 4, Framer Motion and SQLite.

## What's inside

- **Storefront** – animated home page, product catalogue with categories and search, product pages, cart and checkout (orders are saved for the team to confirm payment and shipping).
- **Custom requests** – visitors pick **Epoxy** or **Rug** from a dropdown, choose a size (Small / Medium / Large), upload up to six reference images and send a request. The team sees it in the dashboard.
- **Gallery** – a masonry photo wall with a lightbox. Team members upload photos from the dashboard.
- **Team dashboard** (`/admin`) – sign in to add / edit / hide products (with photo upload), upload gallery photos, review custom requests and orders, and (admins only) invite teammates.
- Light and dark theme, fully responsive, reduced-motion friendly.

## Getting started

```bash
npm install
cp .env.example .env.local   # then edit the values
npm run dev                  # http://localhost:3000
```

The first time the app starts it creates the SQLite database in `data/`, seeds a handful of demo products, and creates the first admin account from `.env.local`:

| Variable         | Default               | Purpose                                     |
| ---------------- | --------------------- | ------------------------------------------- |
| `AUTH_SECRET`    | (dev fallback)        | Signs login cookies. Use a long random string in production. |
| `ADMIN_EMAIL`    | `admin@snorlaxin.com` | First admin login.                          |
| `ADMIN_PASSWORD` | `snorlax123`          | First admin password. Change it after signing in. |
| `ADMIN_NAME`     | `Snorlaxin Team`      | Display name for the first admin.           |
| `DATA_DIR`       | `./data`              | Where the database and uploaded images live. |

Sign in at `/login`, then go to **Account** in the dashboard to change your password and **Team** to invite others. Demo products can be deleted from **Products** once you've added your own.

## Production

```bash
npm run build
npm start
```

Uploaded images and the database live in `DATA_DIR` (default `./data`), so mount that directory on persistent storage when deploying. Any Node host works (a VPS, Railway, Fly.io, Render, a Docker container). Because it uses a local SQLite file and local uploads, it needs a single long-running server rather than a serverless platform.

## Roles

- **Admin** – everything, including managing team accounts.
- **Team** – products, gallery, custom requests and orders.

## Project layout

```
app/            routes (storefront, /custom, /gallery, /login, /admin/…)
app/actions/    server actions (auth, products, gallery, requests, orders, users)
components/     UI (hero, mascot, product cards, forms, admin widgets)
lib/            database, auth, uploads, queries, shared types
public/demo/    illustrations for the seeded demo products
data/           SQLite database + uploads (git-ignored)
```
