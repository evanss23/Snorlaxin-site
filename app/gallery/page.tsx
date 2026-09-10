import type { Metadata } from "next";
import Link from "next/link";
import { GalleryGrid } from "@/components/GalleryGrid";
import { PageEnter } from "@/components/motion";
import { listGallery } from "@/lib/queries";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Gallery" };

export default async function GalleryPage() {
  const [images, session] = await Promise.all([listGallery(), getSession()]);

  return (
    <PageEnter className="container-x py-10 md:py-16">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-snorlax-500 dark:text-snorlax-300">From the workshop</p>
          <h1 className="text-4xl font-bold sm:text-5xl">
            The <span className="text-gradient">gallery</span>
          </h1>
          <p className="mt-4 text-lg text-muted">
            Finished custom pieces, behind-the-scenes pours, tufting progress and happy customers. Tap any photo to see it bigger.
          </p>
        </div>
        {session && (
          <Link href="/admin/gallery" className="btn btn-primary">
            Add photos
          </Link>
        )}
      </div>

      <div className="mt-10">
        {images.length ? (
          <GalleryGrid images={images} />
        ) : (
          <div className="card grid place-items-center px-6 py-24 text-center">
            <p className="font-display text-2xl font-semibold">Nothing on the wall yet.</p>
            <p className="mt-2 max-w-md text-muted">
              Team members can sign in and upload photos from the dashboard. They&apos;ll show up here instantly.
            </p>
          </div>
        )}
      </div>
    </PageEnter>
  );
}
