"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Mascot } from "./Mascot";
import { ease } from "./motion";

const words = ["Plush.", "Pins.", "Epoxy.", "Rugs.", "Naps."];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* backdrop blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-32 top-10 h-[28rem] w-[28rem] rounded-full bg-snorlax-200/60 blur-3xl dark:bg-snorlax-700/40"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-24 top-40 h-[30rem] w-[30rem] rounded-full bg-cream-300/70 blur-3xl dark:bg-snorlax-500/20"
        />
        <div className="dots-bg absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      </div>

      <div className="container-x grid items-center gap-10 pb-16 pt-10 md:grid-cols-2 md:pb-28 md:pt-20">
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="chip mb-6 gap-2 py-1.5 pl-2 pr-4"
          >
            <span className="grid h-6 w-6 place-items-center rounded-full bg-snorlax-500 text-cream-50">
              <Sparkles size={13} />
            </span>
            Handmade custom epoxy & rugs now open
          </motion.div>

          <h1 className="text-5xl font-bold leading-[1.02] sm:text-6xl lg:text-7xl">
            {"Merch for".split("").map((ch, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 30, rotate: -6 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ duration: 0.6, ease, delay: 0.05 + i * 0.03 }}
                className="inline-block"
              >
                {ch === " " ? " " : ch}
              </motion.span>
            ))}
            <br />
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.4 }}
              className="text-gradient inline-block"
            >
              serious nappers.
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.55 }}
            className="mt-6 max-w-lg text-lg leading-relaxed text-muted"
          >
            Snorlaxin is a cosy little Pokémon shop. We hand-pick plush and pins, and hand-make epoxy
            pieces and tufted rugs, all with a dreamy Snorlax twist.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.7 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link href="/shop" className="btn btn-primary text-base">
              Shop the collection <ArrowRight size={18} />
            </Link>
            <Link href="/custom" className="btn btn-secondary text-base">
              Request something custom
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-10 flex flex-wrap gap-x-6 gap-y-2 font-display text-lg font-semibold text-snorlax-500/80 dark:text-snorlax-300/80"
          >
            {words.map((w, i) => (
              <motion.span
                key={w}
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.35, ease: "easeInOut" }}
              >
                {w}
              </motion.span>
            ))}
          </motion.div>
        </div>

        <div className="relative mx-auto w-full max-w-[34rem] md:max-w-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease }}
            className="absolute inset-x-4 bottom-2 top-16 -z-10 rounded-[3rem] bg-gradient-to-br from-snorlax-100 via-cream-200 to-snorlax-200 dark:from-snorlax-800 dark:via-snorlax-900 dark:to-snorlax-700"
          />
          <div className="animate-float">
            <Mascot className="px-6 pt-10 sm:px-10" priority />
          </div>
        </div>
      </div>
    </section>
  );
}
