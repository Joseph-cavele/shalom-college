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
