"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ADMIN_NAV_ITEMS } from "@/config/admin-nav";

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin navigation" className="space-y-2">
      {ADMIN_NAV_ITEMS.map((item) => {
        if (!item.href) {
          return (
            <div
              key={item.title}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2"
            >
              <span className="text-sm text-slate-300">{item.title}</span>
              <span className="rounded-full border border-white/10 px-2 py-0.5 text-xs text-slate-400">
                Soon
              </span>
            </div>
          );
        }

        const isActive = pathname === item.href;

        return (
          <Link
            key={item.title}
            href={item.href}
            className={`block rounded-xl border px-3 py-2 text-sm transition-colors ${
              isActive
                ? "border-white/30 bg-white/15 text-white"
                : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
            }`}
          >
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}