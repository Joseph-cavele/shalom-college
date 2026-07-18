"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Alert } from "@/components/ui/Alert";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const body = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed.");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  }

  return (
    <div className="relative grid min-h-screen place-items-center bg-gradient-to-br from-navy to-navy-light p-6">
      <Link
        href="/"
        className="absolute left-5 top-5 flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>

      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-navy-700 p-9 text-center text-white shadow-lg2"
      >
        <Image src="/logo.png" alt="" width={88} height={88} className="mx-auto mb-4" />
        <h2 className="text-2xl font-extrabold text-white">Welcome Back!</h2>
        <p className="mb-6 mt-1 text-sm text-slate-300">Sign in to your admin account</p>

        {error && <Alert type="error">{error}</Alert>}

        <div className="mb-4 text-left">
          <label className="mb-1.5 block text-sm font-bold text-slate-300">Email Address</label>
          <input
            type="email"
            name="email"
            required
            placeholder="Enter your email"
            defaultValue="josephcavele@gmail.com"
            className="w-full rounded-lg border border-white/15 bg-white/5 px-3.5 py-2.5 text-white outline-none focus:border-brand-green"
          />
        </div>
        <div className="mb-5 text-left">
          <label className="mb-1.5 block text-sm font-bold text-slate-300">Password</label>
          <input
            type="password"
            name="password"
            required
            placeholder="Enter your password"
            className="w-full rounded-lg border border-white/15 bg-white/5 px-3.5 py-2.5 text-white outline-none focus:border-brand-green"
          />
        </div>

        <button type="submit" disabled={loading} className="btn btn-green w-full disabled:opacity-60">
          {loading ? "Signing in…" : "Login"}
        </button>

        <p className="mt-6 text-xs text-slate-400">© 2025 Shalom Training School. All rights reserved.</p>
      </form>
    </div>
  );
}
