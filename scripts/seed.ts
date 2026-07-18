/**
 * Seed the MongoDB database with the default admin, site settings,
 * full course catalogue and a few sample applications/messages.
 *
 * Run with:  npm run seed
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB } from "../lib/mongodb";
import { Course } from "../lib/models/Course";
import { User } from "../lib/models/User";
import { Setting } from "../lib/models/Setting";
import { Application } from "../lib/models/Application";
import { Message } from "../lib/models/Message";
import { SEED_COURSES } from "../lib/data/courses";

async function run() {
  await connectDB();
  console.log("Connected to MongoDB. Seeding…");

  // Admin user — email comes from ADMIN_EMAIL in .env so re-seeding keeps your login.
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@shalomtrainingschool.co.za").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  await User.deleteMany({});
  await User.create({
    fullName: "Admin User",
    email: adminEmail,
    passwordHash: await bcrypt.hash(adminPassword, 10),
    role: "admin",
  });
  console.log("✓ Admin user:", adminEmail, "/", adminPassword);

  // Settings (singleton)
  await Setting.deleteMany({});
  await Setting.create({
    key: "site",
    banners: [
      { title: "MERSETA Artisan Practical Skills Training", active: true },
      { title: "Extra Class Programmes — FET Grades 4–12", active: true },
      { title: "Mining & Construction Short Courses", active: true },
    ],
  });
  console.log("✓ Site settings");

  // Courses
  await Course.deleteMany({});
  await Course.insertMany(SEED_COURSES.map((c) => ({ ...c, active: true })));
  console.log(`✓ ${SEED_COURSES.length} courses`);

  // Sample applications
  await Application.deleteMany({});
  await Application.insertMany([
    { fullName: "John Mokoena", idNumber: "9001015800081", course: "Electrical Engineering (N4–N6)", phone: "071 234 5678", email: "john@example.com", campus: "Rustenburg", status: "Pending" },
    { fullName: "Thabo Koena", idNumber: "9203127800082", course: "Shield Metal Arc Welding (Mild Steel)", phone: "072 345 6789", email: "thabo@example.com", campus: "Brits", status: "Contacted" },
    { fullName: "Sipho Dlamini", idNumber: "9505153800083", course: "Industrial Electronics", phone: "073 456 7890", email: "sipho@example.com", campus: "Rustenburg", status: "Pending" },
    { fullName: "Lerato Nxumalo", idNumber: "9807041800084", course: "Computer Studies", phone: "074 567 8901", email: "lerato@example.com", campus: "Brits", status: "Registered" },
    { fullName: "Peter Mahlangu", idNumber: "9909095800085", course: "Mechanical Engineering (N4–N6)", phone: "075 678 9012", email: "peter@example.com", campus: "Rustenburg", status: "Contacted" },
    { fullName: "Nomsa Khumalo", idNumber: "9402026700086", course: "Trade Test Preparation — Plumbing", phone: "076 789 0123", email: "nomsa@example.com", campus: "Brits", status: "Pending" },
    { fullName: "Andile Zulu", idNumber: "9606158900087", course: "Excavator", phone: "077 890 1234", email: "andile@example.com", campus: "Rustenburg", status: "Pending" },
  ]);
  console.log("✓ Sample applications");

  // Sample messages
  await Message.deleteMany({});
  await Message.insertMany([
    { name: "James Molefe", email: "james@example.com", subject: "Course Information", message: "Hi, I would like more information about your welding courses. Thank you.", read: false },
    { name: "Nandi Sibiya", email: "nandi@example.com", subject: "Application Help", message: "I need help completing my online application form.", read: false },
    { name: "Patrick Mbatha", email: "patrick@example.com", subject: "General Inquiry", message: "What are your operating hours at the Brits campus?", read: true },
    { name: "Kabelo Maseko", email: "kabelo@example.com", subject: "Fees Structure", message: "Please send me the full fees structure for engineering studies.", read: false },
  ]);
  console.log("✓ Sample messages");

  console.log("\nSeed complete. Start the app with:  npm run dev\n");
  process.exit(0);
}

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
