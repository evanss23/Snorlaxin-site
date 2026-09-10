"use client";

import { motion, type HTMLMotionProps, type Variants } from "framer-motion";

export const ease = [0.22, 1, 0.36, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

/** Fades + rises into view when scrolled into the viewport. */
export function Reveal({
  children,
  delay = 0,
  className,
  ...rest
}: HTMLMotionProps<"div"> & { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.75, ease, delay }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Parent that staggers its `StaggerItem` children as they enter the viewport. */
export function Stagger({ children, className, ...rest }: HTMLMotionProps<"div">) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className, ...rest }: HTMLMotionProps<"div">) {
  return (
    <motion.div variants={fadeUp} className={className} {...rest}>
      {children}
    </motion.div>
  );
}

/** Wraps page content with a soft enter animation. */
export function PageEnter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export { motion, AnimatePresence } from "framer-motion";
