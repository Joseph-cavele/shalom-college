import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/guard";
import { connectDB } from "@/lib/mongodb";
import { Application } from "@/lib/models/Application";
import { Course } from "@/lib/models/Course";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  await connectDB();
  const apps = await Application.find().lean();

  const byStatus = {
    Pending: apps.filter((a) => a.status === "Pending").length,
    Contacted: apps.filter((a) => a.status === "Contacted").length,
    Registered: apps.filter((a) => a.status === "Registered").length,
    Rejected: apps.filter((a) => a.status === "Rejected").length,
  };

  const now = new Date();
  const monthly = new Array(12).fill(0);
  let newThisMonth = 0;
  for (const a of apps) {
    const d = new Date(a.createdAt as unknown as string);
    if (isNaN(d.getTime())) continue;
    monthly[d.getMonth()]++;
    if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
      newThisMonth++;
    }
  }

  const courses = await Course.countDocuments({ active: true });

  return NextResponse.json({
    totals: {
      applications: apps.length,
      newThisMonth,
      courses,
      registered: byStatus.Registered,
    },
    byStatus,
    monthly,
  });
}
