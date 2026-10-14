/**
 * Create or update the single school-owner account (there is no public sign-up).
 *
 *   npm run owner:setup -- --email owner@example.com [--name "Jane Doe"]
 *   npm run owner:setup -- --email owner@example.com --disable   # lock the account
 *   npm run owner:setup -- --email owner@example.com --enable    # unlock it
 *   OWNER_PASSWORD='…' npm run owner:setup -- --email owner@example.com --set-password
 *
 * If the email isn't found but exactly one account exists, that account is moved
 * to the new email (keeping its name, avatar and backup password).
 * --email defaults to OWNER_EMAIL from .env.
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "../lib/mongodb";
import { User } from "../lib/models/User";
import { emailSchema } from "../lib/validation";

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : undefined;
}
const flag = (name: string) => process.argv.includes(`--${name}`);

async function run() {
  const parsed = emailSchema.safeParse(arg("email") ?? process.env.OWNER_EMAIL ?? "");
  if (!parsed.success) throw new Error("Pass a valid --email (or set OWNER_EMAIL in .env).");
  const email = parsed.data;
  const name = arg("name")?.trim();

  await connectDB();
  let user = await User.findOne({ email }).select("+passwordHash");

  if (!user) {
    const existing = await User.find().select("+passwordHash");
    if (existing.length > 1) {
      throw new Error(
        `No account for ${email}, and ${existing.length} accounts already exist (${existing
          .map((u) => u.email)
          .join(", ")}). Re-run with one of those emails first.`
      );
    }
    if (existing.length === 1) {
      user = existing[0];
      console.log(`Moving the existing account from ${user.email} to ${email}.`);
      user.email = email;
    } else {
      user = new User({ email, fullName: name || "School Owner" });
      console.log(`Creating a new owner account for ${email}.`);
    }
  }

  user.role = "OWNER";
  if (name) user.fullName = name;
  if (flag("disable")) user.status = "disabled";
  else if (flag("enable") || !user.status) user.status = "active";

  if (flag("set-password")) {
    const pw = process.env.OWNER_PASSWORD || "";
    if (pw.length < 8 || pw.length > 72) throw new Error("Set OWNER_PASSWORD (8–72 characters) to use --set-password.");
    user.passwordHash = await bcrypt.hash(pw, 12);
  }

  await user.save();
  console.log(
    `✓ Owner: ${user.fullName} <${user.email}> · role ${user.role} · ${user.status} · backup password ${
      user.passwordHash ? "set" : "not set"
    }`
  );
}

run()
  .catch((err) => {
    console.error("Owner setup failed:", (err as Error).message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
