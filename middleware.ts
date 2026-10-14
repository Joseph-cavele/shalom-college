import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);

// Convenience redirect only: visitors without a session cookie go straight to
// the login page. Real authorisation (including the active-owner database
// check) happens in the admin layout and in every admin API route. The login
// page itself sends already-signed-in owners on to the dashboard.
export default auth((req) => {
  if (req.nextUrl.pathname === "/admin/login") return NextResponse.next();
  if (!req.auth?.user?.id) return NextResponse.redirect(new URL("/admin/login", req.nextUrl));
  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
