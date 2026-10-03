import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { createToken, setSessionCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Compared against when the email is unknown, so response time doesn't reveal which emails exist.
const DUMMY_HASH = "$2a$10$X/KexubhQ0yK.h5236twAO.04SQZXq.fEbOyCiL0vW4OS1vG1ua7K";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, password } = await req.json();
    if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+passwordHash");
    const valid = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);
    if (!user || !valid) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const token = await createToken({
      id: user._id.toString(),
      email: user.email,
      fullName: user.fullName,
    });
    await setSessionCookie(token);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("POST /api/auth/login", err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
