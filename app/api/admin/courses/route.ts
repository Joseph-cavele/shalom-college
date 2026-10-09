import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/guard";
import { connectDB } from "@/lib/mongodb";
import { Course, courseNameTaken } from "@/lib/models/Course";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  await connectDB();
  const courses = await Course.find().sort({ category: 1, name: 1 }).lean();
  return NextResponse.json({ courses });
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  await connectDB();
  const body = await req.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name || !body.category) {
    return NextResponse.json({ error: "Name and category are required." }, { status: 400 });
  }
  if (await courseNameTaken(name)) {
    return NextResponse.json({ error: `A course named "${name}" already exists.` }, { status: 409 });
  }

  const course = await Course.create({
    name,
    category: body.category,
    duration: body.duration || "",
    fee: Number(body.fee) || 0,
    feeUnit: body.feeUnit || "per course",
    level: body.level || "",
    description: body.description || "",
    image: body.image || "",
    active: body.active !== false,
  });

  return NextResponse.json({ ok: true, course });
}
