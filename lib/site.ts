import { connectDB } from "@/lib/mongodb";
import { Setting } from "@/lib/models/Setting";
import { Course } from "@/lib/models/Course";
import { Application } from "@/lib/models/Application";
import type { SiteSettings, Course as CourseT } from "@/lib/types";

/** Serialise a Mongoose lean doc to a plain JSON-safe object. */
function plain<T>(doc: unknown): T {
  return JSON.parse(JSON.stringify(doc)) as T;
}

/** Load site settings for Server Components (creates defaults if missing). */
export async function getSettings(): Promise<SiteSettings> {
  await connectDB();
  let settings = await Setting.findOne({ key: "site" }).lean();
  if (!settings) settings = (await Setting.create({ key: "site" })).toObject();
  return plain<SiteSettings>(settings);
}

/** Number of applications per course name, used to rank popular courses. */
export async function getApplicationCounts(): Promise<Record<string, number>> {
  await connectDB();
  const rows = await Application.aggregate<{ _id: string; n: number }>([
    { $group: { _id: "$course", n: { $sum: 1 } } },
  ]);
  return Object.fromEntries(rows.map((r) => [r._id, r.n]));
}

/** Load active courses for Server Components. */
export async function getActiveCourses(): Promise<CourseT[]> {
  await connectDB();
  const courses = await Course.find({ active: true }).sort({ category: 1, name: 1 }).lean();
  return plain<CourseT[]>(courses);
}
