"use server";

import { headers } from "next/headers";
import { after } from "next/server";
import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { issueLoginCode } from "@/lib/login-code";
import { sendLoginCodeEmail } from "@/lib/email";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { requestCodeSchema, codeLoginSchema, passwordLoginSchema } from "@/lib/validation";

export type ActionResult = { ok: true; message?: string } | { ok: false; error: string };

const WINDOW = 15 * 60; // seconds
const TOO_MANY = "Too many attempts. Please wait a few minutes and try again.";

/**
 * Step 1: email a sign-in code. An unknown (or disabled) email gets a clear
 * error, at the owner's request — this confirms which address is the admin
 * one, so the rate limits above are what keep guessing slow. The code is
 * issued and emailed after the response is sent.
 */
export async function requestLoginCode(input: { email: string }): Promise<ActionResult> {
  const parsed = requestCodeSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Please enter a valid email address." };
  const { email } = parsed.data;

  const ip = clientIp(await headers());
  if (!(await rateLimit("code-ip", ip, 10, WINDOW)) || !(await rateLimit("code-email", email, 5, WINDOW))) {
    return { ok: false, error: TOO_MANY };
  }

  await connectDB();
  const isOwner = await User.exists({ email, role: "OWNER", status: "active" });
  if (!isOwner) {
    return { ok: false, error: "This email is not registered for admin access. Please check it and try again." };
  }

  after(async () => {
    try {
      const code = await issueLoginCode(email);
      if (code) await sendLoginCodeEmail(email, code); // null = still in resend cooldown
    } catch (err) {
      console.error("Login code issue failed:", (err as Error).message);
    }
  });

  return { ok: true, message: "Code sent! Check your inbox (and spam folder)." };
}

async function signInWith(provider: "email-code" | "password", fields: Record<string, string>): Promise<ActionResult> {
  try {
    // redirect: false — the client navigates, so AUTH_URL never redirects to another host.
    await signIn(provider, { ...fields, redirect: false });
    return { ok: true };
  } catch (err) {
    if (err instanceof AuthError) {
      return {
        ok: false,
        error: provider === "email-code" ? "That code is invalid or has expired." : "Invalid email or password.",
      };
    }
    throw err;
  }
}

/** Step 2: verify the emailed code and start a session. */
export async function verifyCodeLogin(input: { email: string; code: string }): Promise<ActionResult> {
  const parsed = codeLoginSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Enter the 6-digit code from the email." };
  return signInWith("email-code", parsed.data);
}

/** Backup sign-in with a password set on the Profile page. */
export async function passwordLogin(input: { email: string; password: string }): Promise<ActionResult> {
  const parsed = passwordLoginSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid email or password." };
  return signInWith("password", parsed.data);
}

export async function logout(): Promise<void> {
  await signOut({ redirect: false });
}
