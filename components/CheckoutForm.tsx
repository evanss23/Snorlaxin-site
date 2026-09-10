"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { placeOrderAction, type OrderState } from "@/app/actions/orders";
import { useCart } from "./cart/CartProvider";
import { formatPrice } from "@/lib/format";
import { ActionForm } from "./ActionForm";

export function CheckoutForm() {
  const { items, total, ready, clear } = useCart();
  const [state, action, pending] = useActionState<OrderState, FormData>(placeOrderAction, {});
  const router = useRouter();

  useEffect(() => {
    if (state.orderId) {
      clear();
      router.replace(`/checkout/success?order=${state.orderId}`);
    }
  }, [state.orderId, clear, router]);

  if (!ready) return <div className="card h-40 animate-pulse" />;

  if (items.length === 0 && !state.orderId) {
    return (
      <div className="card grid place-items-center px-6 py-20 text-center">
        <p className="font-display text-2xl font-semibold">Nothing to check out yet.</p>
        <Link href="/shop" className="btn btn-primary mt-6">
          Back to the shop
        </Link>
      </div>
    );
  }

  return (
    <ActionForm action={action} className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
      <input type="hidden" name="items" value={JSON.stringify(items.map((i) => ({ product_id: i.product_id, quantity: i.quantity })))} />

      <div className="card space-y-6 p-6 sm:p-8">
        <h2 className="text-2xl font-bold">Shipping details</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="customer_name">
              Full name
            </label>
            <input id="customer_name" name="customer_name" required className="field" placeholder="Ash Ketchum" />
          </div>
          <div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input id="email" name="email" type="email" required className="field" placeholder="you@example.com" />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="address">
            Shipping address
          </label>
          <textarea id="address" name="address" rows={3} required className="field resize-y" placeholder="Street, city, region, postcode, country" />
        </div>
        <div>
          <label className="label" htmlFor="notes">
            Order notes <span className="normal-case tracking-normal opacity-70">(optional)</span>
          </label>
          <textarea id="notes" name="notes" rows={2} className="field resize-y" placeholder="Gift note, delivery instructions…" />
        </div>
        <p className="rounded-2xl bg-snorlax-50 p-4 text-sm text-muted dark:bg-snorlax-800/60">
          We&apos;ll confirm your order by email with a secure payment link and shipping total. Nothing is charged yet.
        </p>
        {state.error && (
          <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-berry-400/15 px-4 py-3 text-sm font-bold text-berry-600">
            {state.error}
          </motion.p>
        )}
      </div>

      <aside className="card h-fit p-6 lg:sticky lg:top-28">
        <h2 className="text-2xl font-bold">Your order</h2>
        <ul className="mt-5 space-y-3">
          {items.map((i) => (
            <li key={i.product_id} className="flex items-center gap-3 text-sm">
              <span className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-cream-200 dark:bg-snorlax-800">
                {i.image_path && <img src={i.image_path} alt="" className="h-full w-full object-cover" />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-bold">{i.name}</span>
                <span className="text-muted">× {i.quantity}</span>
              </span>
              <span className="font-bold">{formatPrice(i.price_cents * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="my-5 border-t border-line" />
        <div className="flex items-baseline justify-between">
          <span className="font-bold">Total</span>
          <span className="font-display text-3xl font-semibold">{formatPrice(total)}</span>
        </div>
        <button type="submit" disabled={pending} className="btn btn-primary mt-6 w-full text-base">
          {pending ? (
            <>
              <Loader2 className="animate-spin" size={18} /> Placing order…
            </>
          ) : (
            <>
              Place order <ArrowRight size={18} />
            </>
          )}
        </button>
      </aside>
    </ActionForm>
  );
}
