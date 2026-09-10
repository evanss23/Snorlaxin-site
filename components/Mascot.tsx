"use client";

import { motion } from "framer-motion";

const ART = {
  classic: { src: "/mascot/snorlax.png", alt: "Snorlax sitting and snoozing", width: 801, height: 634 },
  laptop: { src: "/mascot/snorlax-laptop.png", alt: "Snorlax dozing at a laptop with headphones on", width: 800, height: 575 },
} as const;

/**
 * The Snorlaxin mascot. Breathes gently and snores Zzz's.
 */
export function Mascot({
  className = "",
  zzz = true,
  variant = "classic",
  priority = false,
}: {
  className?: string;
  zzz?: boolean;
  variant?: keyof typeof ART;
  priority?: boolean;
}) {
  const art = ART[variant];
  return (
    <div className={`relative ${className}`}>
      {zzz && (
        <div
          aria-hidden
          className={`pointer-events-none absolute select-none font-display font-bold text-snorlax-500 dark:text-cream-200 ${
            variant === "laptop" ? "left-[52%] top-[2%]" : "left-[62%] top-[-4%]"
          }`}
        >
          <span className="absolute animate-zzz text-3xl" style={{ animationDelay: "0s" }}>z</span>
          <span className="absolute animate-zzz text-4xl" style={{ animationDelay: "1.3s" }}>Z</span>
          <span className="absolute animate-zzz text-2xl" style={{ animationDelay: "2.6s" }}>z</span>
        </div>
      )}
      <motion.img
        src={art.src}
        alt={art.alt}
        width={art.width}
        height={art.height}
        draggable={false}
        fetchPriority={priority ? "high" : undefined}
        className="h-auto w-full origin-bottom animate-breathe select-none drop-shadow-[0_30px_40px_rgba(22,49,63,0.28)]"
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}

/** Tiny inline Snorlax face for the logo. */
export function MascotMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <circle cx="32" cy="34" r="28" fill="#2e6f85" />
      <path d="M14 22 L18 8 L28 18 Z M50 22 L46 8 L36 18 Z" fill="#2e6f85" />
      <ellipse cx="32" cy="40" rx="19" ry="14" fill="#f5e8cf" />
      <path d="M22 38 q4 -3 8 0 M34 38 q4 -3 8 0" stroke="#16313f" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M27 46 q5 4 10 0" stroke="#16313f" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}
