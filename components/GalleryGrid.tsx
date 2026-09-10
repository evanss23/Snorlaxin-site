"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryImage } from "@/lib/types";
import { fadeUp, Stagger } from "./motion";

export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [index, setIndex] = useState<number | null>(null);

  const close = useCallback(() => setIndex(null), []);
  const step = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i === null ? i : (i + dir + images.length) % images.length)),
    [images.length],
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, close, step]);

  return (
    <>
      <Stagger className="columns-2 gap-4 sm:columns-3 lg:columns-4 [&>*]:mb-4">
        {images.map((img, i) => (
          <motion.button
            key={img.id}
            variants={fadeUp}
            type="button"
            onClick={() => setIndex(i)}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="group relative block w-full break-inside-avoid overflow-hidden rounded-3xl bg-cream-200 shadow-soft hover:shadow-lift dark:bg-snorlax-800"
          >
            <img
              src={img.path}
              alt={img.caption || "Gallery image"}
              loading="lazy"
              className="w-full object-cover transition duration-700 group-hover:scale-[1.04]"
            />
            {img.caption && (
              <span className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-snorlax-950/80 to-transparent p-4 pt-10 text-left text-sm font-semibold text-cream-50 transition duration-500 group-hover:translate-y-0">
                {img.caption}
              </span>
            )}
          </motion.button>
        ))}
      </Stagger>

      <AnimatePresence>
        {index !== null && images[index] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-snorlax-950/85 p-4 backdrop-blur-md"
            onClick={close}
          >
            <button
              className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              aria-label="Close"
              onClick={close}
            >
              <X />
            </button>
            {images.length > 1 && (
              <>
                <button
                  className="absolute left-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:grid"
                  aria-label="Previous"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(-1);
                  }}
                >
                  <ChevronLeft />
                </button>
                <button
                  className="absolute right-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:grid"
                  aria-label="Next"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(1);
                  }}
                >
                  <ChevronRight />
                </button>
              </>
            )}
            <motion.figure
              key={images[index].id}
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="max-h-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[index].path}
                alt={images[index].caption || "Gallery image"}
                className="max-h-[82vh] w-auto max-w-full rounded-3xl object-contain shadow-lift"
              />
              {(images[index].caption || images[index].uploader_name) && (
                <figcaption className="mt-4 text-center text-sm text-cream-100/80">
                  {images[index].caption}
                  {images[index].uploader_name && (
                    <span className="text-cream-100/50"> · shared by {images[index].uploader_name}</span>
                  )}
                </figcaption>
              )}
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
