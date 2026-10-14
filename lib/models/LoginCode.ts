import { Schema, model, models } from "mongoose";

// One pending sign-in code per email. Issuing a new code replaces the old one
// (unique email); successful use deletes it. Only an HMAC of the code is stored.
const LoginCodeSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  codeHash: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  attempts: { type: Number, default: 0 },
  createdAt: { type: Date, required: true },
});

// MongoDB removes expired codes in the background (roughly once a minute);
// verification still checks expiresAt explicitly.
LoginCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const LoginCode = models.LoginCode || model("LoginCode", LoginCodeSchema);
