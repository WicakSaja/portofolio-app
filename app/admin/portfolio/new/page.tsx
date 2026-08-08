import Link from "next/link";

import { PortfolioCreateForm } from "@/components/admin/portfolio-create-form";

export default function NewPortfolioPage() {
  return (
    <div className="px-6 py-8 sm:px-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Create Portfolio</h2>
          <p className="mt-1 text-sm text-slate-300">Add a new portfolio project for the public website.</p>
        </div>
        <Link
          href="/admin"
          className="inline-flex h-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 text-sm text-slate-200 transition-colors hover:bg-white/10"
        >
          Back to Dashboard
        </Link>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
        <PortfolioCreateForm />
      </div>
    </div>
  );
}