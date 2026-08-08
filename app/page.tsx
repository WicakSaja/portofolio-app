export default function Home() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(120,119,198,0.12),_transparent_35%),linear-gradient(180deg,_#0f172a_0%,_#020617_100%)] text-slate-50">
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-16 sm:px-10 lg:px-12">
        <div className="max-w-2xl space-y-8">
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 backdrop-blur">
            Personal Portfolio CMS
          </div>
          <div className="space-y-5">
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              A clean admin-first portfolio foundation for content you control.
            </h1>
            <p className="max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
              Manage projects, skills, experience, contact details, and site settings from one dashboard, while the public site stays fast and responsive.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="/admin"
              className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-medium text-slate-950 transition-colors hover:bg-slate-200"
            >
              Open Dashboard
            </a>
            <a
              href="/projects"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              View Public Site
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
