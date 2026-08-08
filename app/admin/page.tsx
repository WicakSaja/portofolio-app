import Link from "next/link";

import { ADMIN_NAV_ITEMS } from "@/config/admin-nav";

export default function AdminPage() {
  const sections = ADMIN_NAV_ITEMS.filter((item) => item.title !== "Overview");

  return (
    <div className="px-6 py-8 sm:px-8">
      <div className="max-w-2xl space-y-4">
        <h2 className="text-3xl font-semibold tracking-tight text-white">Dashboard overview</h2>
        <p className="text-sm leading-6 text-slate-300">
          Use the sections below to manage the portfolio content that powers the public site.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {sections.map((section) => (
          <section
            key={section.title}
            className="rounded-2xl border border-white/10 bg-white/5 p-5"
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg font-medium text-white">{section.title}</h3>
              {!section.href ? (
                <span className="rounded-full border border-white/10 px-2 py-0.5 text-xs text-slate-400">
                  Soon
                </span>
              ) : null}
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-300">{section.description}</p>
            {section.href ? (
              <Link
                href={section.href}
                className="mt-4 inline-flex text-sm font-medium text-slate-100 hover:text-white"
              >
                Open section
              </Link>
            ) : null}
          </section>
        ))}
      </div>
    </div>
  );
}