import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/guard";
import { connectDB } from "@/lib/mongodb";
import { Message } from "@/lib/models/Message";

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
  if (body.read !== undefined) update.read = !!body.read;

  const message = await Message.findByIdAndUpdate(id, update, { new: true }).lean();
  if (!message) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, message });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  await connectDB();
  const { id } = await params;
  await Message.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
