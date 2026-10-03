import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/guard";
import { connectDB } from "@/lib/mongodb";
import { Application } from "@/lib/models/Application";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  await connectDB();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const q = searchParams.get("q");

  const filter: Record<string, unknown> = {};
  if (status && status !== "all") filter.status = status;
  if (q) {
    // Escape so search text is matched literally, not run as a regular expression.
    const rx = q.slice(0, 100).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.$or = [
      { fullName: { $regex: rx, $options: "i" } },
      { course: { $regex: rx, $options: "i" } },
      { phone: { $regex: rx, $options: "i" } },
    ];
  }

  const applications = await Application.find(filter).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ applications });
}
