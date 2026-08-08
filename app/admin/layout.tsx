import type { ReactNode } from "react";

import { DashboardNav } from "@/components/admin/dashboard-nav";
import { LogoutButton } from "@/components/shared/auth-buttons";

export default function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-white/10 bg-white/5 px-6 py-4 backdrop-blur sm:px-10 lg:px-12">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Portfolio CMS</p>
            <h1 className="text-lg font-semibold text-white">Admin Dashboard</h1>
          </div>
          <LogoutButton callbackUrl="/" />
        </div>
      </header>
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-6 py-6 sm:px-10 lg:grid-cols-[240px_1fr] lg:px-12">
        <aside className="h-fit rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="mb-3 text-xs uppercase tracking-[0.18em] text-slate-400">Navigation</p>
          <DashboardNav />
        </aside>
        <main className="rounded-2xl border border-white/10 bg-white/5">{children}</main>
      </div>
    </div>
  );
}