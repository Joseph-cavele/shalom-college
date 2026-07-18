import { connectDB } from "@/lib/mongodb";
import { Setting } from "@/lib/models/Setting";
import { Course } from "@/lib/models/Course";
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

/** Load active courses for Server Components. */
export async function getActiveCourses(): Promise<CourseT[]> {
  await connectDB();
  const courses = await Course.find({ active: true }).sort({ category: 1, name: 1 }).lean();
  return plain<CourseT[]>(courses);
}
