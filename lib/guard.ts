import { NextResponse } from "next/server";
import { getSession, SessionPayload } from "@/lib/auth";

/**
 * Guard for admin API route handlers. Returns the session when authenticated,
 * otherwise a 401 NextResponse to return early.
 *
 *   const auth = await requireAuth();
 *   if (auth instanceof NextResponse) return auth;
 */
export async function requireAuth(): Promise<SessionPayload | NextResponse> {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  return session;
}
