import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, PackageCheck, Sparkles, Truck } from "lucide-react";
import { AddToCart } from "@/components/AddToCart";
import { ProductGrid } from "@/components/ProductGrid";
import { PageEnter, Reveal } from "@/components/motion";
import { formatPrice } from "@/lib/format";
import { getProductBySlug, relatedProducts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  return { title: product?.name ?? "Product", description: product?.description.slice(0, 160) };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product || product.active !== 1) notFound();
  const related = relatedProducts(product);

  return (
    <PageEnter className="container-x py-8 md:py-14">
      <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-bold text-muted transition hover:text-snorlax-600">
        <ArrowLeft size={16} /> Back to shop
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <Reveal className="card overflow-hidden p-3">
          <div className="relative aspect-square overflow-hidden rounded-[1.8rem] bg-cream-200 dark:bg-snorlax-800">
            {product.image_path ? (
              <img src={product.image_path} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full place-items-center text-muted">No photo yet</div>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.1} className="flex flex-col justify-center">
          <span className="chip w-fit">{product.category}</span>
          <h1 className="mt-4 text-4xl font-bold leading-[1.05] sm:text-5xl">{product.name}</h1>
          <p className="mt-4 font-display text-3xl font-semibold text-snorlax-600 dark:text-snorlax-200">
            {formatPrice(product.price_cents)}
          </p>
          <p className="mt-6 whitespace-pre-line text-lg leading-relaxed text-muted">{product.description}</p>

          <p className="mt-6 text-sm font-bold">
            {product.stock > 0 ? (
              <span className="text-moss-500">
                {product.stock <= 5 ? `Only ${product.stock} left` : "In stock"} · ready to ship
              </span>
            ) : (
              <span className="text-berry-500">Sold out, check back soon</span>
            )}
          </p>

          <div className="mt-6">
            <AddToCart product={product} />
          </div>

          <ul className="mt-10 grid gap-3 text-sm text-muted sm:grid-cols-3">
            <li className="flex items-center gap-2">
              <Truck size={16} className="text-snorlax-500" /> Ships in 2–4 days
            </li>
            <li className="flex items-center gap-2">
              <PackageCheck size={16} className="text-snorlax-500" /> Cosy packaging
            </li>
            <li className="flex items-center gap-2">
              <Sparkles size={16} className="text-snorlax-500" /> Fan-made with love
            </li>
          </ul>
        </Reveal>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="mb-8 text-3xl font-bold">You might also like</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </PageEnter>
  );
}
