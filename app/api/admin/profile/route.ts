import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { requireAuth } from "@/lib/guard";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { createToken, setSessionCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  await connectDB();
  const user = await User.findById(auth.id).select("fullName email role avatar").lean();
  return NextResponse.json({ admin: user });
}

export async function PUT(req: NextRequest) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  await connectDB();
  const user = await User.findById(auth.id).select("+passwordHash");
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { fullName, email, currentPassword, newPassword } = await req.json();
  const isStr = (v: unknown): v is string => typeof v === "string";

  if (fullName !== undefined && (!isStr(fullName) || !fullName.trim() || fullName.length > 100)) {
    return NextResponse.json({ error: "Please enter a valid name." }, { status: 400 });
  }
  if (email !== undefined && (!isStr(email) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  if (newPassword) {
    if (!isStr(newPassword) || newPassword.length < 8 || newPassword.length > 72) {
      return NextResponse.json({ error: "New password must be 8–72 characters." }, { status: 400 });
    }
    if (!isStr(currentPassword) || !(await bcrypt.compare(currentPassword, user.passwordHash))) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
    }
    user.passwordHash = await bcrypt.hash(newPassword, 12);
  }
  if (fullName) user.fullName = fullName.trim();
  if (email) user.email = email.trim().toLowerCase();

  try {
    await user.save();
  } catch (err) {
    if ((err as { code?: number }).code === 11000) {
      return NextResponse.json({ error: "That email is already in use." }, { status: 409 });
    }
    throw err;
  }

  // Refresh the session cookie so the top bar reflects the new name/email.
  const token = await createToken({ id: user._id.toString(), email: user.email, fullName: user.fullName });
  await setSessionCookie(token);

  return NextResponse.json({ ok: true, admin: { fullName: user.fullName, email: user.email } });
}
