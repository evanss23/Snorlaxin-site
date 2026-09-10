"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Moon, ShoppingBag, Sun, X, LogIn, LayoutDashboard } from "lucide-react";
import { MascotMark } from "./Mascot";
import { useCart } from "./cart/CartProvider";
import { useTheme } from "./ThemeProvider";

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/custom", label: "Custom" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
];

export function Nav({ signedIn }: { signedIn: boolean }) {
  const pathname = usePathname();
  const { count, lastAdded } = useCart();
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-50 px-3 pt-3 sm:px-5"
      >
        <div
          className={`container-x glass flex items-center justify-between rounded-full border border-line py-2.5 transition-shadow duration-500 ${
            scrolled ? "shadow-lift" : "shadow-soft"
          }`}
        >
          <Link href="/" className="group flex items-center gap-2.5">
            <motion.span whileHover={{ rotate: -8, scale: 1.08 }} className="inline-flex">
              <MascotMark />
            </motion.span>
            <span className="font-display text-2xl font-bold tracking-tight">
              Snorlax<span className="text-snorlax-500 dark:text-snorlax-300">in</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => {
              const active = pathname === l.href || pathname.startsWith(l.href + "/");
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`relative rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                    active ? "text-snorlax-600 dark:text-snorlax-200" : "text-muted hover:text-snorlax-600 dark:hover:text-cream-100"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-snorlax-100 dark:bg-snorlax-800"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{l.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5">
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className="grid h-10 w-10 place-items-center rounded-full text-muted transition hover:bg-snorlax-100 hover:text-snorlax-700 dark:hover:bg-snorlax-800 dark:hover:text-cream-100"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.25 }}
                  className="inline-flex"
                >
                  {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                </motion.span>
              </AnimatePresence>
            </button>

            <Link
              href={signedIn ? "/admin" : "/login"}
              aria-label={signedIn ? "Admin dashboard" : "Team login"}
              className="hidden h-10 w-10 place-items-center rounded-full text-muted transition hover:bg-snorlax-100 hover:text-snorlax-700 sm:grid dark:hover:bg-snorlax-800 dark:hover:text-cream-100"
            >
              {signedIn ? <LayoutDashboard size={18} /> : <LogIn size={18} />}
            </Link>

            <Link
              href="/cart"
              aria-label="Cart"
              className="relative grid h-10 w-10 place-items-center rounded-full text-muted transition hover:bg-snorlax-100 hover:text-snorlax-700 dark:hover:bg-snorlax-800 dark:hover:text-cream-100"
            >
              <motion.span key={count} initial={{ scale: 1 }} animate={{ scale: [1, 1.25, 1] }} transition={{ duration: 0.35 }} className="inline-flex">
                <ShoppingBag size={18} />
              </motion.span>
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-berry-500 px-1 text-[11px] font-bold text-white"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            <button
              onClick={() => setOpen((o) => !o)}
              aria-label="Menu"
              className="grid h-10 w-10 place-items-center rounded-full text-muted transition hover:bg-snorlax-100 md:hidden dark:hover:bg-snorlax-800"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="container-x mt-2 md:hidden"
            >
              <div className="glass card flex flex-col gap-1 p-3">
                {links.map((l) => (
                  <Link key={l.href} href={l.href} className="rounded-2xl px-4 py-3 font-bold hover:bg-snorlax-100 dark:hover:bg-snorlax-800">
                    {l.label}
                  </Link>
                ))}
                <Link href={signedIn ? "/admin" : "/login"} className="rounded-2xl px-4 py-3 font-bold text-muted hover:bg-snorlax-100 dark:hover:bg-snorlax-800">
                  {signedIn ? "Dashboard" : "Team login"}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Added-to-cart toast */}
      <AnimatePresence>
        {lastAdded && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-5 left-1/2 z-50 w-[min(92vw,26rem)] -translate-x-1/2"
          >
            <div className="card flex items-center gap-3 p-3 pr-4">
              <div className="h-12 w-12 overflow-hidden rounded-2xl bg-cream-200 dark:bg-snorlax-800">
                {lastAdded.image_path && <img src={lastAdded.image_path} alt="" className="h-full w-full object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{lastAdded.name}</p>
                <p className="text-xs text-muted">Tucked into your cart</p>
              </div>
              <Link href="/cart" className="btn btn-primary btn-sm">
                View
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
