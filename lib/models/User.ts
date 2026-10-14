import mongoose, { Schema, model, models, InferSchemaType } from "mongoose";

export const USER_STATUSES = ["active", "disabled"] as const;

// The single school-owner account. Created/updated with `npm run owner:setup`
// (there is no public registration).
const UserSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
    // Optional backup password (sign-in is normally by emailed code). Never
    // returned by queries unless explicitly requested with .select("+passwordHash").
    passwordHash: { type: String, select: false },
    role: { type: String, enum: ["OWNER"], default: "OWNER" },
    status: { type: String, enum: USER_STATUSES, default: "active" },
    avatar: { type: String, default: "" },
  },
  { timestamps: true }
);

export type UserType = InferSchemaType<typeof UserSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const User = models.User || model("User", UserSchema);
