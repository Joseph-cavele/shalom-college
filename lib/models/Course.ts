import mongoose, { Schema, model, models, InferSchemaType } from "mongoose";

const CourseSchema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true, index: true },
    duration: { type: String, default: "" },
    fee: { type: Number, default: 0 },
    feeUnit: { type: String, default: "per course" },
    level: { type: String, default: "" },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type CourseType = InferSchemaType<typeof CourseSchema> & { _id: mongoose.Types.ObjectId };

export const Course = models.Course || model("Course", CourseSchema);

/** True if another course already uses this name (case-insensitive, ignoring `exceptId`). */
export async function courseNameTaken(name: string, exceptId?: string): Promise<boolean> {
  const escaped = name.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const filter: Record<string, unknown> = { name: { $regex: `^\\s*${escaped}\\s*$`, $options: "i" } };
  if (exceptId) filter._id = { $ne: exceptId };
  return !!(await Course.exists(filter));
}
