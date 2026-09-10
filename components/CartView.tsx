"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "./cart/CartProvider";
import { formatPrice } from "@/lib/format";

export function CartView() {
  const { items, total, ready, setQuantity, remove } = useCart();

  if (!ready) return <div className="card h-40 animate-pulse" />;

  if (items.length === 0) {
    return (
      <div className="card grid place-items-center px-6 py-24 text-center">
        <p className="font-display text-3xl font-semibold">Your cart is napping.</p>
        <p className="mt-2 text-muted">Nothing in here yet. Let&apos;s fix that.</p>
        <Link href="/shop" className="btn btn-primary mt-8">
          Browse the shop <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
      <ul className="space-y-4">
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <motion.li
              key={item.product_id}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -40, height: 0 }}
              className="card flex items-center gap-4 p-3 sm:p-4"
            >
              <Link href={`/shop/${item.slug}`} className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-cream-200 sm:h-24 sm:w-24 dark:bg-snorlax-800">
                {item.image_path && <img src={item.image_path} alt={item.name} className="h-full w-full object-cover" />}
              </Link>
              <div className="min-w-0 flex-1">
                <Link href={`/shop/${item.slug}`} className="block truncate font-display text-lg font-semibold hover:text-snorlax-600">
                  {item.name}
                </Link>
                <p className="text-sm text-muted">{formatPrice(item.price_cents)} each</p>
                <div className="mt-3 inline-flex items-center rounded-full border border-line">
                  <button
                    type="button"
                    onClick={() => setQuantity(item.product_id, item.quantity - 1)}
                    className="grid h-9 w-9 place-items-center rounded-full hover:bg-snorlax-100 dark:hover:bg-snorlax-800"
                    aria-label="Decrease"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-7 text-center text-sm font-bold tabular-nums">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(item.product_id, item.quantity + 1)}
                    className="grid h-9 w-9 place-items-center rounded-full hover:bg-snorlax-100 dark:hover:bg-snorlax-800"
                    aria-label="Increase"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3">
                <p className="font-display text-lg font-semibold">{formatPrice(item.price_cents * item.quantity)}</p>
                <button
                  type="button"
                  onClick={() => remove(item.product_id)}
                  className="grid h-9 w-9 place-items-center rounded-full text-muted transition hover:bg-berry-400/15 hover:text-berry-600"
                  aria-label="Remove"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <motion.aside layout className="card h-fit p-6 lg:sticky lg:top-28">
        <h2 className="text-2xl font-bold">Summary</h2>
        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd className="font-bold">{formatPrice(total)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Shipping</dt>
            <dd className="font-bold">Calculated at checkout</dd>
          </div>
        </dl>
        <div className="my-5 border-t border-line" />
        <div className="flex items-baseline justify-between">
          <span className="font-bold">Total</span>
          <span className="font-display text-3xl font-semibold">{formatPrice(total)}</span>
        </div>
        <Link href="/checkout" className="btn btn-primary mt-6 w-full text-base">
          Checkout <ArrowRight size={18} />
        </Link>
        <Link href="/shop" className="mt-3 block text-center text-sm font-bold text-muted hover:text-snorlax-600">
          Keep browsing
        </Link>
      </motion.aside>
    </div>
  );
}
