import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { ProductGrid } from "@/components/ProductGrid";
import { PageEnter } from "@/components/motion";
import { listProducts, productCategories } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Shop" };

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category, q } = await searchParams;
  const products = listProducts({ category, q });
  const categories = productCategories();

  return (
    <PageEnter className="container-x py-10 md:py-16">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-snorlax-500 dark:text-snorlax-300">The shop</p>
          <h1 className="text-4xl font-bold sm:text-5xl">
            {category ? category : "Everything"} <span className="text-gradient">{category ? "" : "cosy"}</span>
          </h1>
          <p className="mt-3 text-muted">
            {products.length} {products.length === 1 ? "item" : "items"}
            {q ? ` matching “${q}”` : ""}
          </p>
        </div>
        <form className="relative w-full max-w-sm" action="/shop">
          {category && <input type="hidden" name="category" value={category} />}
          <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input name="q" defaultValue={q ?? ""} placeholder="Search the den…" className="field pl-11" />
        </form>
      </div>

      <div className="no-scrollbar mt-8 flex gap-2 overflow-x-auto pb-2">
        <CategoryPill href="/shop" label="All" active={!category} />
        {categories.map((c) => (
          <CategoryPill key={c} href={`/shop?category=${encodeURIComponent(c)}`} label={c} active={category === c} />
        ))}
      </div>

      <div className="mt-8">
        {products.length ? (
          <ProductGrid products={products} />
        ) : (
          <div className="card grid place-items-center px-6 py-20 text-center">
            <p className="font-display text-2xl font-semibold">Nothing here but a snoring Snorlax.</p>
            <p className="mt-2 text-muted">Try another category or clear your search.</p>
            <Link href="/shop" className="btn btn-primary mt-6">
              Show everything
            </Link>
          </div>
        )}
      </div>
    </PageEnter>
  );
}

function CategoryPill({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-bold transition ${
        active
          ? "border-snorlax-500 bg-snorlax-500 text-cream-50 shadow-[0_8px_18px_-8px_rgba(46,111,133,.9)]"
          : "border-line bg-surface text-muted hover:-translate-y-0.5 hover:text-snorlax-600 dark:hover:text-cream-100"
      }`}
    >
      {label}
    </Link>
  );
}
