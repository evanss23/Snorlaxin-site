import Link from "next/link";
import { ArrowRight, Images, Inbox, Package, Receipt } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Stagger, StaggerItem } from "@/components/motion";
import { getCurrentUser } from "@/lib/auth";
import { formatDate, formatPrice } from "@/lib/format";
import { dashboardStats, listOrders, listRequests } from "@/lib/queries";
import { CUSTOM_TYPES } from "@/lib/types";
import { StatusChip } from "@/components/admin/StatusChip";

export default async function AdminHome({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const user = await getCurrentUser();
  const stats = dashboardStats();
  const requests = listRequests().slice(0, 5);
  const orders = listOrders().slice(0, 5);

  const cards = [
    { label: "Products live", value: stats.activeProducts, sub: `${stats.products} total · ${stats.lowStock} low stock`, href: "/admin/products", icon: Package },
    { label: "Gallery photos", value: stats.gallery, sub: "Shown on the site", href: "/admin/gallery", icon: Images },
    { label: "New requests", value: stats.newRequests, sub: `${stats.requests} all time`, href: "/admin/requests", icon: Inbox },
    { label: "Pending orders", value: stats.pendingOrders, sub: `${formatPrice(stats.revenue)} all time`, href: "/admin/orders", icon: Receipt },
  ];

  return (
    <>
      <AdminHeader title={`Good ${greeting()}, ${user?.name.split(" ")[0] ?? "friend"}`} body="Here's what's happening in the den.">
        <Link href="/admin/products/new" className="btn btn-primary btn-sm">
          Add product
        </Link>
        <Link href="/admin/gallery" className="btn btn-secondary btn-sm">
          Upload photos
        </Link>
      </AdminHeader>

      {error === "forbidden" && (
        <p className="mb-6 rounded-2xl bg-berry-400/15 px-4 py-3 text-sm font-bold text-berry-600">Only admins can manage the team.</p>
      )}

      <Stagger className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <StaggerItem key={c.label}>
            <Link href={c.href} className="card group block p-5 transition hover:-translate-y-1 hover:shadow-lift">
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-snorlax-100 text-snorlax-600 dark:bg-snorlax-800 dark:text-snorlax-200">
                  <c.icon size={18} />
                </span>
                <ArrowRight size={16} className="text-muted transition group-hover:translate-x-1 group-hover:text-snorlax-500" />
              </div>
              <p className="mt-4 font-display text-4xl font-semibold">{c.value}</p>
              <p className="text-sm font-bold">{c.label}</p>
              <p className="text-xs text-muted">{c.sub}</p>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <section className="card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Latest custom requests</h2>
            <Link href="/admin/requests" className="text-sm font-bold text-snorlax-500 hover:underline">
              View all
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-[var(--line)]">
            {requests.length === 0 && <li className="py-6 text-sm text-muted">No requests yet.</li>}
            {requests.map((r) => (
              <li key={r.id} className="flex items-center gap-3 py-3">
                <span className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-cream-200 dark:bg-snorlax-800">
                  {r.images[0] && <img src={r.images[0]} alt="" className="h-full w-full object-cover" />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">
                    {r.name} · {CUSTOM_TYPES.find((t) => t.value === r.product_type)?.label} · <span className="capitalize">{r.size}</span>
                  </p>
                  <p className="truncate text-xs text-muted">{r.notes || r.email}</p>
                </div>
                <StatusChip status={r.status} />
              </li>
            ))}
          </ul>
        </section>
        <section className="card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Latest orders</h2>
            <Link href="/admin/orders" className="text-sm font-bold text-snorlax-500 hover:underline">
              View all
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-[var(--line)]">
            {orders.length === 0 && <li className="py-6 text-sm text-muted">No orders yet.</li>}
            {orders.map((o) => (
              <li key={o.id} className="flex items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">
                    #{o.id} · {o.customer_name}
                  </p>
                  <p className="text-xs text-muted">
                    {o.items.reduce((n, i) => n + i.quantity, 0)} items · {formatDate(o.created_at)}
                  </p>
                </div>
                <span className="font-bold">{formatPrice(o.total_cents)}</span>
                <StatusChip status={o.status} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "morning" : h < 18 ? "afternoon" : "evening";
}
