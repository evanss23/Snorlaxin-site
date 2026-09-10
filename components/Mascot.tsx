"use client";

import { motion } from "framer-motion";

/**
 * A stylised sleeping Snorlax drawn in SVG. Breathes gently and snores Zzz's.
 */
export function Mascot({ className = "", zzz = true }: { className?: string; zzz?: boolean }) {
  return (
    <div className={`relative ${className}`} aria-hidden>
      {zzz && (
        <div className="pointer-events-none absolute right-[12%] top-[6%] select-none font-display font-bold text-snorlax-500 dark:text-cream-200">
          <span className="absolute animate-zzz text-3xl" style={{ animationDelay: "0s" }}>z</span>
          <span className="absolute animate-zzz text-4xl" style={{ animationDelay: "1.3s" }}>Z</span>
          <span className="absolute animate-zzz text-2xl" style={{ animationDelay: "2.6s" }}>z</span>
        </div>
      )}
      <motion.svg
        viewBox="0 0 520 420"
        className="h-auto w-full animate-breathe origin-bottom drop-shadow-[0_30px_40px_rgba(22,49,63,0.25)]"
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        <defs>
          <linearGradient id="body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3a7f96" />
            <stop offset="1" stopColor="#234f60" />
          </linearGradient>
          <linearGradient id="belly" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fbf4e6" />
            <stop offset="1" stopColor="#ecd7ad" />
          </linearGradient>
        </defs>
        {/* ground shadow */}
        <ellipse cx="260" cy="395" rx="215" ry="22" fill="#16313f" opacity="0.12" />
        {/* feet */}
        <g>
          <ellipse cx="110" cy="352" rx="56" ry="40" fill="url(#body)" />
          <ellipse cx="108" cy="352" rx="34" ry="24" fill="url(#belly)" />
          <circle cx="92" cy="342" r="6" fill="#6b4b3a" />
          <circle cx="108" cy="336" r="6" fill="#6b4b3a" />
          <circle cx="124" cy="342" r="6" fill="#6b4b3a" />
          <ellipse cx="410" cy="352" rx="56" ry="40" fill="url(#body)" />
          <ellipse cx="412" cy="352" rx="34" ry="24" fill="url(#belly)" />
          <circle cx="396" cy="342" r="6" fill="#6b4b3a" />
          <circle cx="412" cy="336" r="6" fill="#6b4b3a" />
          <circle cx="428" cy="342" r="6" fill="#6b4b3a" />
        </g>
        {/* body */}
        <path
          d="M260 150 C 380 150 440 230 440 300 C 440 370 360 380 260 380 C 160 380 80 370 80 300 C 80 230 140 150 260 150 Z"
          fill="url(#body)"
        />
        {/* belly */}
        <path
          d="M260 195 C 345 195 390 250 390 305 C 390 355 335 372 260 372 C 185 372 130 355 130 305 C 130 250 175 195 260 195 Z"
          fill="url(#belly)"
        />
        {/* arms */}
        <ellipse cx="112" cy="262" rx="42" ry="30" fill="url(#body)" transform="rotate(-25 112 262)" />
        <ellipse cx="408" cy="262" rx="42" ry="30" fill="url(#body)" transform="rotate(25 408 262)" />
        {/* head */}
        <path
          d="M260 40 C 340 40 390 95 390 160 C 390 205 340 225 260 225 C 180 225 130 205 130 160 C 130 95 180 40 260 40 Z"
          fill="url(#body)"
        />
        {/* ears */}
        <path d="M150 95 L165 40 L200 80 Z" fill="url(#body)" />
        <path d="M370 95 L355 40 L320 80 Z" fill="url(#body)" />
        {/* face */}
        <path
          d="M260 120 C 320 120 350 150 350 180 C 350 210 320 222 260 222 C 200 222 170 210 170 180 C 170 150 200 120 260 120 Z"
          fill="url(#belly)"
        />
        {/* sleepy eyes */}
        <path d="M218 162 q14 -10 28 0" stroke="#16313f" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M274 162 q14 -10 28 0" stroke="#16313f" strokeWidth="6" fill="none" strokeLinecap="round" />
        {/* mouth */}
        <path d="M238 190 q22 14 44 0" stroke="#16313f" strokeWidth="5" fill="none" strokeLinecap="round" />
        {/* teeth */}
        <path d="M248 190 l4 7 l4 -7 Z M264 190 l4 7 l4 -7 Z" fill="#fff" />
        {/* blush */}
        <ellipse cx="205" cy="185" rx="10" ry="6" fill="#f28b8b" opacity="0.55" />
        <ellipse cx="315" cy="185" rx="10" ry="6" fill="#f28b8b" opacity="0.55" />
      </motion.svg>
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
