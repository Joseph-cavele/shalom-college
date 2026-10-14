"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, KeyRound, Mail } from "lucide-react";
import { Alert } from "@/components/ui/Alert";
import { requestLoginCode, verifyCodeLogin, passwordLogin, type ActionResult } from "./actions";

type Step = "email" | "code" | "password";

const RESEND_SECONDS = 60;

const inputCls =
  "w-full rounded-lg border border-white/15 bg-white/5 px-3.5 py-2.5 text-white outline-none placeholder:text-slate-500 focus:border-brand-green";

export function LoginForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [pending, startTransition] = useTransition();
  const codeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  useEffect(() => {
    if (step === "code") codeRef.current?.focus();
  }, [step]);

  /** Run a server action; ignores clicks while one is already in flight. */
  function run(action: () => Promise<ActionResult>, onOk: (r: ActionResult & { ok: true }) => void) {
    if (pending) return;
    setError("");
    startTransition(async () => {
      try {
        const res = await action();
        if (res.ok) onOk(res);
        else setError(res.error);
      } catch {
        setError("Something went wrong. Please try again.");
      }
    });
  }

  function sendCode() {
    run(
      () => requestLoginCode({ email }),
      (res) => {
        setNotice(res.message || "");
        setStep("code");
        setCooldown(RESEND_SECONDS);
      }
    );
  }

  function onSubmitEmail(e: React.FormEvent) {
    e.preventDefault();
    sendCode();
  }

  function onSubmitCode(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const code = String(new FormData(e.currentTarget).get("code") || "");
    run(
      () => verifyCodeLogin({ email, code }),
      () => {
        router.push("/admin");
        router.refresh();
      }
    );
  }

  function onSubmitPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const password = String(new FormData(e.currentTarget).get("password") || "");
    run(
      () => passwordLogin({ email, password }),
      () => {
        router.push("/admin");
        router.refresh();
      }
    );
  }

  function changeEmail() {
    setStep("email");
    setError("");
    setNotice("");
  }

  return (
    <div className="relative grid min-h-screen place-items-center bg-gradient-to-br from-navy to-navy-light p-4 sm:p-6">
      <Link
        href="/"
        className="absolute left-5 top-5 flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>

      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-navy-700 p-7 text-center text-white shadow-lg2 sm:p-9">
        <Image src="/logo.png" alt="" width={88} height={88} className="mx-auto mb-4" />
        <h2 className="text-2xl font-extrabold text-white">Welcome Back!</h2>
        <p className="mb-6 mt-1 text-sm text-slate-300">
          {step === "code"
            ? "Check your inbox for a 6-digit code"
            : step === "password"
              ? "Sign in with your password"
              : "Sign in to the Shalom admin dashboard"}
        </p>

        {error && <Alert type="error">{error}</Alert>}
        {notice && step === "code" && !error && <Alert type="success">{notice}</Alert>}

        {step === "email" && (
          <form onSubmit={onSubmitEmail}>
            <div className="mb-5 text-left">
              <label htmlFor="login-email" className="mb-1.5 block text-sm font-bold text-slate-300">
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={inputCls}
              />
            </div>
            <button type="submit" disabled={pending} className="btn btn-green w-full disabled:opacity-60">
              <Mail className="h-4 w-4" />
              {pending ? "Sending code…" : "Send verification code"}
            </button>
            <button
              type="button"
              onClick={() => {
                setError("");
                setStep("password");
              }}
              className="mt-4 text-sm font-semibold text-slate-300 underline-offset-4 hover:text-white hover:underline"
            >
              Use password instead
            </button>
          </form>
        )}

        {step === "code" && (
          <form onSubmit={onSubmitCode}>
            <p className="mb-4 break-all text-sm text-slate-300">
              Code sent to <b className="text-white">{email}</b>
            </p>
            <div className="mb-5 text-left">
              <label htmlFor="login-code" className="mb-1.5 block text-sm font-bold text-slate-300">
                Verification Code
              </label>
              <input
                id="login-code"
                ref={codeRef}
                name="code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="\d{6}"
                required
                placeholder="••••••"
                // Keep digits only, then cap at 6 — so a pasted "123 456" still works.
                onInput={(e) => (e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "").slice(0, 6))}
                className={`${inputCls} text-center font-mono text-2xl tracking-[0.5em]`}
              />
              <p className="mt-1.5 text-xs text-slate-400">The code expires after 10 minutes.</p>
            </div>
            <button type="submit" disabled={pending} className="btn btn-green w-full disabled:opacity-60">
              <KeyRound className="h-4 w-4" />
              {pending ? "Verifying…" : "Verify and sign in"}
            </button>
            <div className="mt-4 flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={changeEmail}
                disabled={pending}
                className="font-semibold text-slate-300 hover:text-white disabled:opacity-60"
              >
                Change email
              </button>
              <button
                type="button"
                onClick={sendCode}
                disabled={pending || cooldown > 0}
                className={
                  pending || cooldown > 0
                    ? "cursor-not-allowed font-semibold text-slate-500"
                    : "font-semibold text-brand-green hover:underline"
                }
              >
                {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
              </button>
            </div>
          </form>
        )}

        {step === "password" && (
          <form onSubmit={onSubmitPassword}>
            <div className="mb-4 text-left">
              <label htmlFor="pw-email" className="mb-1.5 block text-sm font-bold text-slate-300">
                Email Address
              </label>
              <input
                id="pw-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={inputCls}
              />
            </div>
            <div className="mb-5 text-left">
              <label htmlFor="pw-password" className="mb-1.5 block text-sm font-bold text-slate-300">
                Password
              </label>
              <input
                id="pw-password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="Enter your password"
                className={inputCls}
              />
            </div>
            <button type="submit" disabled={pending} className="btn btn-green w-full disabled:opacity-60">
              {pending ? "Signing in…" : "Sign in"}
            </button>
            <button
              type="button"
              onClick={changeEmail}
              className="mt-4 text-sm font-semibold text-slate-300 underline-offset-4 hover:text-white hover:underline"
            >
              Email me a code instead
            </button>
          </form>
        )}

        <p className="mt-6 text-xs text-slate-400">© {new Date().getFullYear()} Shalom Training School. All rights reserved.</p>
      </div>
    </div>
  );
}
