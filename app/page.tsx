import Link from "next/link";
import { ArrowRight, Brush, Heart, Images, PackageCheck, Ruler, Upload } from "lucide-react";
import { Hero } from "@/components/Hero";
import { ProductGrid } from "@/components/ProductGrid";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { featuredProducts, listGallery } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const products = featuredProducts(8);
  const gallery = listGallery(6);

  return (
    <>
      <Hero />

      {/* Featured products */}
      <section className="container-x py-16 md:py-24">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Fresh from the den"
            title={
              <>
                Featured <span className="text-gradient">favourites</span>
              </>
            }
            body="A few things we can't stop napping next to. New drops land here first."
          />
          <Reveal delay={0.2}>
            <Link href="/shop" className="btn btn-ghost">
              View all <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>
        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <EmptyState text="No products yet. Sign in to add the first one." />
        )}
      </section>

      {/* Custom CTA */}
      <section className="container-x py-10 md:py-16">
        <Reveal>
          <div className="relative overflow-hidden rounded-5xl bg-snorlax-900 px-6 py-14 text-cream-100 shadow-lift sm:px-12 md:px-16 md:py-20 dark:bg-snorlax-800">
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-snorlax-500/40 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-cream-300/20 blur-3xl" />
            <div className="relative grid items-center gap-10 md:grid-cols-2">
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-snorlax-200">Made just for you</p>
                <h2 className="text-4xl font-bold leading-[1.05] md:text-5xl">
                  Dream it. We&apos;ll pour it or tuft it.
                </h2>
                <p className="mt-5 max-w-md text-lg leading-relaxed text-snorlax-100/85">
                  Send us a reference image, pick epoxy or rug, choose a size, and we&apos;ll get back to you with a quote.
                </p>
                <Link href="/custom" className="btn mt-8 bg-cream-100 text-snorlax-900 hover:-translate-y-0.5 hover:bg-white">
                  Start a custom request <ArrowRight size={18} />
                </Link>
              </div>
              <Stagger className="grid gap-4 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3">
                {[
                  { icon: Upload, title: "Upload", body: "Share a sketch, photo or screenshot." },
                  { icon: Brush, title: "Pick a craft", body: "Epoxy resin or hand-tufted rug." },
                  { icon: Ruler, title: "Pick a size", body: "Small, medium or large." },
                ].map((s) => (
                  <StaggerItem key={s.title} className="rounded-3xl border border-cream-100/15 bg-cream-100/10 p-5 backdrop-blur">
                    <s.icon className="mb-3 text-cream-200" size={22} />
                    <h3 className="font-display text-lg font-semibold">{s.title}</h3>
                    <p className="mt-1 text-sm text-snorlax-100/80">{s.body}</p>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Gallery preview */}
      <section className="container-x py-16 md:py-24">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="From the workshop"
            title={
              <>
                Our <span className="text-gradient">gallery</span>
              </>
            }
            body="Finished pieces, works in progress and the occasional very sleepy cat."
          />
          <Reveal delay={0.2}>
            <Link href="/gallery" className="btn btn-ghost">
              See everything <Images size={16} />
            </Link>
          </Reveal>
        </div>
        {gallery.length > 0 ? (
          <Stagger className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
            {gallery.map((g, i) => (
              <StaggerItem
                key={g.id}
                className={`overflow-hidden rounded-3xl bg-cream-200 dark:bg-snorlax-800 ${i === 0 ? "col-span-2 row-span-2" : ""}`}
              >
                <Link href="/gallery" className="group block h-full">
                  <img
                    src={g.path}
                    alt={g.caption || "Gallery image"}
                    className="aspect-square h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        ) : (
          <EmptyState text="The gallery is waiting for its first photo. Team members can add pictures from the dashboard." />
        )}
      </section>

      {/* Values */}
      <section className="container-x pb-10 pt-6 md:pb-16">
        <Stagger className="grid gap-5 md:grid-cols-3">
          {[
            { icon: Heart, title: "Made with care", body: "Every custom piece is poured or tufted by hand in small batches." },
            { icon: PackageCheck, title: "Packed like a nap", body: "Snug, recyclable packaging so everything arrives comfy." },
            { icon: Images, title: "Always sharing", body: "We post finished pieces to the gallery so you can see what's possible." },
          ].map((v) => (
            <StaggerItem key={v.title} className="card p-7">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-snorlax-100 text-snorlax-600 dark:bg-snorlax-800 dark:text-snorlax-200">
                <v.icon size={22} />
              </span>
              <h3 className="mt-5 text-xl font-semibold">{v.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{v.body}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>
    </>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="card grid place-items-center px-6 py-16 text-center text-muted">
      <p className="max-w-md">{text}</p>
    </div>
  );
}
