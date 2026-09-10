import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Mascot } from "@/components/Mascot";
import { PageEnter } from "@/components/motion";
import { formatPrice } from "@/lib/format";
import { getOrder } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Order placed" };

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const { order: id } = await searchParams;
  const order = id ? getOrder(Number(id)) : null;
  if (!order) notFound();

  return (
    <PageEnter className="container-x py-10 md:py-16">
      <div className="card mx-auto max-w-3xl overflow-hidden p-8 text-center sm:p-12">
        <Mascot className="mx-auto max-w-[18rem]" />
        <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-snorlax-500 dark:text-snorlax-300">Order #{order.id}</p>
        <h1 className="mt-2 text-4xl font-bold sm:text-5xl">Thank you, {order.customer_name.split(" ")[0]}!</h1>
        <p className="mx-auto mt-4 max-w-md text-muted">
          Your order is in. We&apos;ve sent a confirmation to <span className="font-bold">{order.email}</span> and will follow up
          with a secure payment link and shipping details.
        </p>
        <ul className="mx-auto mt-8 max-w-md divide-y divide-[var(--line)] text-left text-sm">
          {order.items.map((i) => (
            <li key={i.product_id} className="flex items-center justify-between py-3">
              <span>
                <span className="font-bold">{i.name}</span> <span className="text-muted">× {i.quantity}</span>
              </span>
              <span className="font-bold">{formatPrice(i.price_cents * i.quantity)}</span>
            </li>
          ))}
          <li className="flex items-center justify-between py-3 font-display text-xl font-semibold">
            <span>Total</span>
            <span>{formatPrice(order.total_cents)}</span>
          </li>
        </ul>
        <Link href="/shop" className="btn btn-primary mt-8">
          Keep shopping
        </Link>
      </div>
    </PageEnter>
  );
}
