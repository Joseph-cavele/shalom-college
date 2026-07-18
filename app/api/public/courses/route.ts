import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Course } from "@/lib/models/Course";

export const dynamic = "force-dynamic";

// Public list of active courses.
export async function GET() {
  try {
    await connectDB();
    const courses = await Course.find({ active: true }).sort({ category: 1, name: 1 }).lean();
    return NextResponse.json({ courses });
  } catch (err) {
    console.error("GET /api/public/courses", err);
    return NextResponse.json({ error: "Failed to load courses" }, { status: 500 });
  }
}
