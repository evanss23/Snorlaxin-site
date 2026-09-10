"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Minus, Plus, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/types";
import { useCart } from "./cart/CartProvider";

export function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const soldOut = product.stock <= 0;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="inline-flex items-center rounded-full border border-line bg-surface">
        <button
          type="button"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="grid h-12 w-12 place-items-center rounded-full transition hover:bg-snorlax-100 dark:hover:bg-snorlax-800"
          aria-label="Decrease quantity"
        >
          <Minus size={16} />
        </button>
        <span className="w-8 text-center font-bold tabular-nums">{qty}</span>
        <button
          type="button"
          onClick={() => setQty((q) => Math.min(product.stock || 1, q + 1))}
          className="grid h-12 w-12 place-items-center rounded-full transition hover:bg-snorlax-100 dark:hover:bg-snorlax-800"
          aria-label="Increase quantity"
        >
          <Plus size={16} />
        </button>
      </div>
      <motion.button
        type="button"
        whileTap={{ scale: 0.96 }}
        disabled={soldOut}
        onClick={() => {
          add(
            {
              product_id: product.id,
              slug: product.slug,
              name: product.name,
              price_cents: product.price_cents,
              image_path: product.image_path,
            },
            qty,
          );
          setAdded(true);
          setTimeout(() => setAdded(false), 1800);
        }}
        className="btn btn-primary h-12 min-w-44 text-base"
      >
        {soldOut ? (
          "Sold out"
        ) : added ? (
          <>
            <Check size={18} /> Added
          </>
        ) : (
          <>
            <ShoppingBag size={18} /> Add to cart
          </>
        )}
      </motion.button>
    </div>
  );
}
