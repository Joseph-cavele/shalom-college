import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Setting } from "@/lib/models/Setting";

export const dynamic = "force-dynamic";

// Public site settings + homepage content.
export async function GET() {
  try {
    await connectDB();
    let settings = await Setting.findOne({ key: "site" }).lean();
    if (!settings) settings = (await Setting.create({ key: "site" })).toObject();
    return NextResponse.json({ settings });
  } catch (err) {
    console.error("GET /api/public/info", err);
    return NextResponse.json({ error: "Failed to load settings" }, { status: 500 });
  }
}
