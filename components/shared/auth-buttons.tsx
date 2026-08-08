"use client";

import { useState } from "react";
import { signIn, signOut } from "next-auth/react";

type AuthButtonProps = {
  callbackUrl: string;
};

export function LoginButton({ callbackUrl }: AuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    await signIn("github", { callbackUrl });
  };

  return (
    <button
      type="button"
      onClick={handleLogin}
      disabled={isLoading}
      className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-medium text-slate-950 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isLoading ? "Connecting..." : "Continue with GitHub"}
    </button>
  );
}

export function LogoutButton({ callbackUrl }: AuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    await signOut({ callbackUrl });
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoading}
      className="inline-flex h-10 items-center justify-center rounded-full border border-white/15 bg-white/5 px-4 text-sm font-medium text-white transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isLoading ? "Signing out..." : "Logout"}
    </button>
  );
}