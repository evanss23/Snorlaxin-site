"use client";

import type { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";
import { Stagger } from "./motion";

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <Stagger className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} index={i} />
      ))}
    </Stagger>
  );
}
