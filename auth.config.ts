import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe Auth.js config shared by middleware and `auth.ts`. Providers (which
 * need MongoDB) are added in `auth.ts` only.
 */
export const authConfig = {
  pages: { signIn: "/admin/login" },
  // Encrypted JWT in an httpOnly cookie (Secure + __Secure- prefix on HTTPS).
  session: { strategy: "jwt", maxAge: 8 * 60 * 60, updateAge: 60 * 60 },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (typeof token.id === "string") session.user.id = token.id;
      if (typeof token.role === "string") session.user.role = token.role;
      return session;
    },
  },
} satisfies NextAuthConfig;
