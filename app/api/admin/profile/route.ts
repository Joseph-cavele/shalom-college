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
  const user = await User.findById(auth.id);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { fullName, email, currentPassword, newPassword } = await req.json();

  if (newPassword) {
    if (!currentPassword || !(await bcrypt.compare(currentPassword, user.passwordHash))) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
    }
    user.passwordHash = await bcrypt.hash(newPassword, 10);
  }
  if (fullName) user.fullName = fullName;
  if (email) user.email = String(email).toLowerCase();
  await user.save();

  // Refresh the session cookie so the top bar reflects the new name/email.
  const token = await createToken({ id: user._id.toString(), email: user.email, fullName: user.fullName });
  await setSessionCookie(token);

  return NextResponse.json({ ok: true, admin: { fullName: user.fullName, email: user.email } });
}
