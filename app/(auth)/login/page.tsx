import { LoginButton } from "@/components/shared/auth-buttons";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(120,119,198,0.12),_transparent_35%),linear-gradient(180deg,_#0f172a_0%,_#020617_100%)] px-6 py-16 text-slate-50 sm:px-10 lg:px-12">
      <div className="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-md items-center">
        <div className="w-full space-y-8 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Admin access</p>
            <h1 className="text-3xl font-semibold tracking-tight text-white">Sign in with GitHub</h1>
            <p className="text-sm leading-6 text-slate-300">
              Only the configured GitHub account can access the dashboard. No registration or password login is available.
            </p>
          </div>
          <LoginButton callbackUrl="/admin" />
        </div>
      </div>
    </main>
  );
}