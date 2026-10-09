import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/guard";
import { connectDB } from "@/lib/mongodb";
import { Application, APPLICATION_STATUSES, type ApplicationType } from "@/lib/models/Application";
import { notifyStatusChange } from "@/lib/email";

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
  if (body.status) {
    if (!APPLICATION_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    update.status = body.status;
  }

  // Return the previous version so we only email the applicant on a real change.
  const previous = await Application.findByIdAndUpdate(id, update).lean<ApplicationType>();
  if (!previous) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (update.status && update.status !== previous.status) {
    await notifyStatusChange(previous, update.status as string);
  }

  const application = { ...previous, ...update };
  return NextResponse.json({ ok: true, application });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  await connectDB();
  const { id } = await params;
  await Application.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
