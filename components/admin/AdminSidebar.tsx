"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Images, Inbox, LayoutDashboard, LogOut, Package, Receipt, Users, ExternalLink, UserCog } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import type { User } from "@/lib/types";

const items = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/gallery", label: "Gallery", icon: Images },
  { href: "/admin/requests", label: "Custom requests", icon: Inbox },
  { href: "/admin/orders", label: "Orders", icon: Receipt },
  { href: "/admin/team", label: "Team", icon: Users, adminOnly: true },
  { href: "/admin/account", label: "Account", icon: UserCog },
];

export function AdminSidebar({ user, badges }: { user: User; badges: Record<string, number> }) {
  const pathname = usePathname();
  return (
    <aside className="card flex flex-col p-3 lg:sticky lg:top-28 lg:h-[calc(100dvh-9rem)]">
      <div className="flex items-center gap-3 px-3 py-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-snorlax-500 font-display text-lg font-bold text-cream-50">
          {user.name.slice(0, 1).toUpperCase()}
        </span>
        <div className="min-w-0">
          <p className="truncate font-bold leading-tight">{user.name}</p>
          <p className="truncate text-xs capitalize text-muted">{user.role}</p>
        </div>
      </div>
      <nav className="no-scrollbar mt-2 flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
        {items
          .filter((i) => !i.adminOnly || user.role === "admin")
          .map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            const badge = badges[item.href];
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex shrink-0 items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-bold transition ${
                  active ? "text-snorlax-700 dark:text-cream-50" : "text-muted hover:text-snorlax-600 dark:hover:text-cream-100"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="admin-pill"
                    className="absolute inset-0 rounded-2xl bg-snorlax-100 dark:bg-snorlax-800"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <item.icon size={18} className="relative" />
                <span className="relative whitespace-nowrap">{item.label}</span>
                {badge ? (
                  <span className="relative ml-auto rounded-full bg-berry-500 px-2 py-0.5 text-[11px] font-bold text-white">{badge}</span>
                ) : null}
              </Link>
            );
          })}
      </nav>
      <div className="mt-auto hidden flex-col gap-1 pt-4 lg:flex">
        <Link href="/" className="flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-bold text-muted transition hover:text-snorlax-600">
          <ExternalLink size={18} /> View site
        </Link>
        <form action={logoutAction}>
          <button className="flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-bold text-muted transition hover:bg-berry-400/10 hover:text-berry-600">
            <LogOut size={18} /> Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
