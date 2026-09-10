import type { Metadata } from "next";
import Link from "next/link";
import { Mascot } from "@/components/Mascot";
import { PageEnter, Reveal, Stagger, StaggerItem } from "@/components/motion";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <PageEnter className="container-x py-10 md:py-16">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-snorlax-500 dark:text-snorlax-300">About Snorlaxin</p>
          <h1 className="text-4xl font-bold leading-[1.05] sm:text-5xl">
            A tiny shop with <span className="text-gradient">big nap energy</span>
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            Snorlaxin started as a kitchen-table hobby: a few resin coasters for friends and one very ambitious tufted rug.
            Now we pour, tuft and curate Pokémon merch for fans who appreciate the finer things, like a good sleep.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Every custom piece is made by hand in small batches. We photograph the ones we&apos;re proudest of for the gallery,
            and we&apos;re always up for a new challenge.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/custom" className="btn btn-primary">
              Request a custom piece
            </Link>
            <Link href="/gallery" className="btn btn-secondary">
              Peek at the gallery
            </Link>
          </div>
        </div>
        <Reveal>
          <Mascot className="mx-auto max-w-md" />
        </Reveal>
      </div>

      <Stagger className="mt-20 grid gap-5 sm:grid-cols-3">
        {[
          ["Hand-poured", "Epoxy pieces are mixed, tinted and poured one at a time, then cured for days."],
          ["Hand-tufted", "Rugs are tufted on a frame, sheared, glued and backed by hand."],
          ["Fan-made", "We're fans first. Pokémon and Snorlax belong to Nintendo / Game Freak."],
        ].map(([title, body]) => (
          <StaggerItem key={title} className="card p-7">
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="mt-2 leading-relaxed text-muted">{body}</p>
          </StaggerItem>
        ))}
      </Stagger>
    </PageEnter>
  );
}
