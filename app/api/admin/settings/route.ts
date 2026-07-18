import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/guard";
import { connectDB } from "@/lib/mongodb";
import { Setting } from "@/lib/models/Setting";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  await connectDB();
  let settings = await Setting.findOne({ key: "site" }).lean();
  if (!settings) settings = (await Setting.create({ key: "site" })).toObject();
  return NextResponse.json({ settings });
}

export async function PUT(req: NextRequest) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  await connectDB();
  const body = await req.json();
  // Never allow the identity key to be overwritten.
  delete body.key;
  delete body._id;

  const settings = await Setting.findOneAndUpdate(
    { key: "site" },
    { $set: body },
    { new: true, upsert: true }
  ).lean();

  return NextResponse.json({ ok: true, settings });
}
