"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { useCart } from "./cart/CartProvider";
import { fadeUp } from "./motion";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { add } = useCart();
  const soldOut = product.stock <= 0;

  return (
    <motion.article variants={fadeUp} custom={index} className="group relative">
      <Link href={`/shop/${product.slug}`} className="block">
        <motion.div
          whileHover={{ y: -8 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className="card overflow-hidden p-2.5 transition-shadow duration-500 group-hover:shadow-lift"
        >
          <div className="relative aspect-square overflow-hidden rounded-[1.6rem] bg-cream-200 dark:bg-snorlax-800">
            {product.image_path ? (
              <img
                src={product.image_path}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                loading="lazy"
              />
            ) : (
              <div className="grid h-full w-full place-items-center text-muted">No photo yet</div>
            )}
            <div className="absolute left-3 top-3 flex gap-2">
              <span className="chip glass">{product.category}</span>
            </div>
            {soldOut && (
              <div className="absolute inset-0 grid place-items-center bg-snorlax-950/50 backdrop-blur-[2px]">
                <span className="rounded-full bg-cream-100 px-4 py-1.5 font-display font-bold text-snorlax-900">Sold out</span>
              </div>
            )}
            {product.featured === 1 && !soldOut && (
              <span className="absolute right-3 top-3 rounded-full bg-berry-500 px-2.5 py-1 text-[11px] font-bold text-white shadow">
                Fave
              </span>
            )}
          </div>
          <div className="flex items-start justify-between gap-3 px-2.5 pb-2 pt-4">
            <div className="min-w-0">
              <h3 className="truncate font-display text-lg font-semibold leading-tight">{product.name}</h3>
              <p className="mt-1 text-sm text-muted">{formatPrice(product.price_cents)}</p>
            </div>
            <motion.button
              type="button"
              whileTap={{ scale: 0.9 }}
              disabled={soldOut}
              aria-label={`Add ${product.name} to cart`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                add({
                  product_id: product.id,
                  slug: product.slug,
                  name: product.name,
                  price_cents: product.price_cents,
                  image_path: product.image_path,
                });
              }}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-snorlax-500 text-cream-50 shadow-[0_8px_18px_-8px_rgba(46,111,133,.9)] transition hover:bg-snorlax-600 disabled:opacity-40"
            >
              <ShoppingBag size={17} />
            </motion.button>
          </div>
        </motion.div>
      </Link>
    </motion.article>
  );
}
