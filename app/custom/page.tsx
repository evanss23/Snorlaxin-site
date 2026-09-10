import type { Metadata } from "next";
import { CustomRequestForm } from "@/components/CustomRequestForm";
import { PageEnter, Reveal } from "@/components/motion";
import { CUSTOM_TYPES } from "@/lib/types";

export const metadata: Metadata = {
  title: "Custom requests",
  description: "Request a custom epoxy piece or tufted rug. Upload a reference image, pick a size, and we'll send a quote.",
};

export default async function CustomPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;

  return (
    <PageEnter className="container-x py-10 md:py-16">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-snorlax-500 dark:text-snorlax-300">Custom orders</p>
          <h1 className="text-4xl font-bold leading-[1.05] sm:text-5xl">
            Something <span className="text-gradient">made just for you</span>
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            Right now we&apos;re taking custom requests for hand-poured epoxy and hand-tufted rugs. Show us what you have in
            mind and we&apos;ll reply with a quote, a timeline and any questions.
          </p>

          <div className="mt-8 grid gap-4">
            {CUSTOM_TYPES.map((t, i) => (
              <Reveal key={t.value} delay={0.1 * i} className="card flex gap-4 p-5">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-snorlax-100 font-display text-xl font-bold text-snorlax-600 dark:bg-snorlax-800 dark:text-snorlax-200">
                  {t.label[0]}
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold">{t.label}</h3>
                  <p className="mt-1 text-sm text-muted">{t.blurb}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <ol className="mt-8 space-y-3 text-sm text-muted">
            {[
              "Pick epoxy or rug and a rough size.",
              "Upload reference images (sketches, screenshots, photos).",
              "We email you a quote. Approve it and we start making.",
              "Your finished piece gets photographed for the gallery (if you're okay with that!) and shipped to you.",
            ].map((step, i) => (
              <li key={step} className="flex gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-snorlax-500 text-xs font-bold text-cream-50">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <Reveal delay={0.15}>
          <CustomRequestForm initialType={type} />
        </Reveal>
      </div>
    </PageEnter>
  );
}
