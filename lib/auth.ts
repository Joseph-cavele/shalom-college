import { isValidObjectId } from "mongoose";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";

export interface SessionPayload {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

/**
 * The signed-in owner, or null. Beyond validating the Auth.js session cookie it
 * re-reads the account, so a disabled or deleted owner loses access on the very
 * next request. Every protected page, route handler and server action goes
 * through this (directly or via `requireAuth`); middleware is only a convenience.
 */
export async function getSession(): Promise<SessionPayload | null> {
  const session = await auth();
  const id = session?.user?.id;
  if (!id || !isValidObjectId(id)) return null;

  await connectDB();
  const owner = await User.findOne({ _id: id, role: "OWNER", status: "active" })
    .select("fullName email role")
    .lean<{ fullName: string; email: string; role: string }>();
  if (!owner) return null;

  return { id, email: owner.email, fullName: owner.fullName, role: owner.role };
}
