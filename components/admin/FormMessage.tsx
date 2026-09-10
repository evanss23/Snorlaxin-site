"use client";

import { AnimatePresence, motion } from "framer-motion";

export function FormMessage({ error, success }: { error?: string; success?: string }) {
  return (
    <AnimatePresence mode="wait">
      {(error || success) && (
        <motion.p
          key={error ?? success}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className={`rounded-2xl px-4 py-3 text-sm font-bold ${
            error ? "bg-berry-400/15 text-berry-600" : "bg-moss-500/15 text-moss-500"
          }`}
        >
          {error ?? success}
        </motion.p>
      )}
    </AnimatePresence>
  );
}
