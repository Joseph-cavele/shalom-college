/**
 * One-off: sync course durations in MongoDB with lib/data/courses.ts
 * without touching applications, messages or settings.
 *
 * Run with:  npx tsx scripts/update-durations.ts
 */
import "dotenv/config";
import { connectDB } from "../lib/mongodb";
import { Course } from "../lib/models/Course";

async function run() {
  await connectDB();

  const r1 = await Course.updateMany(
    { category: "Engineering Studies", name: { $regex: /Electrical|Mechanical/i } },
    { $set: { duration: "3 months per N level" } }
  );
  const r2 = await Course.updateMany(
    { category: "Management Programmes" },
    { $set: { duration: "6 months per N level" } }
  );
  const r3 = await Course.updateMany(
    { category: "Mining & Construction" },
    { $set: { duration: "2 weeks" } }
  );

  console.log("Engineering (Elec/Mech):", r1.modifiedCount);
  console.log("Management:", r2.modifiedCount);
  console.log("Mining & Construction:", r3.modifiedCount);
  process.exit(0);
}

run().catch((err) => {
  console.error("Update failed:", err);
  process.exit(1);
});
