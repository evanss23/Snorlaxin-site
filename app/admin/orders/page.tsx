import { updateOrderStatusAction } from "@/app/actions/orders";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { formatDate, formatPrice } from "@/lib/format";
import { listOrders } from "@/lib/queries";
import { ORDER_STATUSES } from "@/lib/types";

export default function AdminOrders() {
  const orders = listOrders();
  return (
    <>
      <AdminHeader title="Orders" body="Orders placed through the shop. Update the status as you confirm payment and ship." />
      {orders.length === 0 ? (
        <div className="card grid place-items-center px-6 py-20 text-center text-muted">No orders yet.</div>
      ) : (
        <ul className="grid gap-4">
          {orders.map((o) => (
            <li key={o.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted">
                    Order #{o.id} · {formatDate(o.created_at)}
                  </p>
                  <h2 className="mt-1 text-2xl font-bold">{o.customer_name}</h2>
                  <a href={`mailto:${o.email}?subject=Your Snorlaxin order #${o.id}`} className="text-sm font-bold text-snorlax-500 hover:underline">
                    {o.email}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-display text-2xl font-semibold">{formatPrice(o.total_cents)}</span>
                  <StatusSelect action={updateOrderStatusAction} id={o.id} value={o.status} options={ORDER_STATUSES} />
                </div>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <ul className="divide-y divide-[var(--line)] text-sm">
                  {o.items.map((i) => (
                    <li key={i.product_id} className="flex items-center gap-3 py-2">
                      <span className="h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-cream-200 dark:bg-snorlax-800">
                        {i.image_path && <img src={i.image_path} alt="" className="h-full w-full object-cover" />}
                      </span>
                      <span className="flex-1 truncate font-bold">{i.name}</span>
                      <span className="text-muted">× {i.quantity}</span>
                      <span className="font-bold">{formatPrice(i.price_cents * i.quantity)}</span>
                    </li>
                  ))}
                </ul>
                <div className="rounded-2xl bg-snorlax-50 p-4 text-sm dark:bg-snorlax-800/60">
                  <p className="label">Ship to</p>
                  <p className="whitespace-pre-line">{o.address}</p>
                  {o.notes && (
                    <>
                      <p className="label mt-3">Notes</p>
                      <p className="whitespace-pre-line">{o.notes}</p>
                    </>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
