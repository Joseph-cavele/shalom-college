import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/guard";
import { connectDB } from "@/lib/mongodb";
import { Course } from "@/lib/models/Course";

export const dynamic = "force-dynamic";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  await connectDB();
  const { id } = await params;
  const body = await req.json();

  const update: Record<string, unknown> = {};
  ["name", "category", "duration", "feeUnit", "level", "description", "image"].forEach((k) => {
    if (body[k] !== undefined) update[k] = body[k];
  });
  if (body.fee !== undefined) update.fee = Number(body.fee) || 0;
  if (body.active !== undefined) update.active = !!body.active;

  const course = await Course.findByIdAndUpdate(id, update, { new: true }).lean();
  if (!course) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, course });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  await connectDB();
  const { id } = await params;
  await Course.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
