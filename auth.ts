import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "@/auth.config";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { verifyLoginCode } from "@/lib/login-code";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { codeLoginSchema, passwordLoginSchema } from "@/lib/validation";

// Compared against when the email is unknown, so response time doesn't reveal which emails exist.
const DUMMY_HASH = "$2a$10$X/KexubhQ0yK.h5236twAO.04SQZXq.fEbOyCiL0vW4OS1vG1ua7K";
const WINDOW = 15 * 60; // rate-limit window, seconds

interface OwnerDoc {
  _id: { toString(): string };
  fullName: string;
  email: string;
  role: string;
  passwordHash?: string;
}

function findActiveOwner(email: string, withPassword = false) {
  const q = User.findOne({ email, role: "OWNER", status: "active" });
  return (withPassword ? q.select("+passwordHash") : q).lean<OwnerDoc>();
}

const toUser = (o: OwnerDoc) => ({ id: o._id.toString(), name: o.fullName, email: o.email, role: o.role });

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    // Primary: six-digit code emailed to the owner.
    Credentials({
      id: "email-code",
      name: "Email code",
      credentials: { email: {}, code: {} },
      async authorize(raw, request) {
        const parsed = codeLoginSchema.safeParse(raw);
        if (!parsed.success) return null;
        const { email, code } = parsed.data;

        const ip = clientIp(request.headers);
        if (!(await rateLimit("verify-ip", ip, 30, WINDOW))) return null;
        if (!(await rateLimit("verify-email", email, 15, WINDOW))) return null;

        await connectDB();
        if (!(await verifyLoginCode(email, code))) return null;
        // Re-check the account after the code is consumed (it may have been disabled meanwhile).
        const owner = await findActiveOwner(email);
        return owner ? toUser(owner) : null;
      },
    }),
    // Backup: password (only works once the owner has set one on the Profile page).
    Credentials({
      id: "password",
      name: "Password",
      credentials: { email: {}, password: {} },
      async authorize(raw, request) {
        const parsed = passwordLoginSchema.safeParse(raw);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;

        const ip = clientIp(request.headers);
        if (!(await rateLimit("password-ip", ip, 10, WINDOW))) return null;
        if (!(await rateLimit("password-email", email, 5, WINDOW))) return null;

        await connectDB();
        const owner = await findActiveOwner(email, true);
        const valid = await bcrypt.compare(password, owner?.passwordHash || DUMMY_HASH);
        return owner && owner.passwordHash && valid ? toUser(owner) : null;
      },
    }),
  ],
});
