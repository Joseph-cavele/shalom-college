import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";
import { isValidSaPhone, looksLikeSaId, parseSaId } from "@/lib/sa-id";
import { connectDB } from "@/lib/mongodb";
import { Application, STUDY_MODES } from "@/lib/models/Application";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { notifyNewApplication, confirmApplicationReceived } from "@/lib/email";

export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = Number(process.env.MAX_FILE_UPLOAD_SIZE) || 5 * 1024 * 1024;

// Save a single uploaded file: Cloudinary first, local disk fallback.
async function saveFile(file: FormDataEntryValue | null): Promise<string> {
  if (!file || typeof file !== "object" || !("arrayBuffer" in file) || file.size === 0) return "";
  if (file.size > MAX_FILE_SIZE) throw new Error("A document exceeds the maximum file size (5MB).");

  const bytes = Buffer.from(await file.arrayBuffer());
  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");

  const cloudUrl = await uploadToCloudinary(bytes, safe).catch(() => null);
  if (cloudUrl) return cloudUrl;

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  const filename = `${Date.now()}-${safe}`;
  await writeFile(path.join(uploadDir, filename), bytes);
  return `/uploads/${filename}`;
}

const str = (form: FormData, key: string) => String(form.get(key) || "").trim().slice(0, 300);

// Short, readable reference without look-alike characters (no 0/O, 1/I).
function newReference(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(6);
  return "SHA-" + Array.from(bytes, (b) => chars[b % chars.length]).join("");
}

// Submit a course application (multipart form; several optional document uploads).
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const form = await req.formData();

    const fullName = str(form, "fullName");
    const phone = str(form, "phone");
    const course = str(form, "course");
    const idNumber = str(form, "idNumber");
    const email = str(form, "email");

    const bad = (error: string) => NextResponse.json({ error }, { status: 400 });
    if (!fullName || !phone || !course) return bad("Full name, cell phone and course are required.");
    if (!isValidSaPhone(phone)) return bad("Please enter a valid South African phone number, e.g. 071 234 5678.");
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return bad("Please enter a valid email address.");
    if (looksLikeSaId(idNumber) && !parseSaId(idNumber).valid) {
      return bad("That South African ID number is not valid. Please check it and try again.");
    }
    const studyMode = str(form, "studyMode");
    if (!STUDY_MODES.includes(studyMode)) return bad("Please choose full-time or part-time study.");
    if (form.get("consent") !== "on") {
      return bad("Please agree to the privacy notice so we can process your application.");
    }

    let docId = "", docResults = "", docResidence = "", docFee = "";
    try {
      [docId, docResults, docResidence, docFee] = await Promise.all([
        saveFile(form.get("docId")),
        saveFile(form.get("docResults")),
        saveFile(form.get("docResidence")),
        saveFile(form.get("docFee")),
      ]);
    } catch (e) {
      return NextResponse.json({ error: (e as Error).message }, { status: 400 });
    }

    const application = {
      reference: newReference(),
      consentAt: new Date(),
      course,
      campus: str(form, "campus"),
      studyMode,
      fullName,
      idNumber: idNumber.replace(/\s/g, ""),
      dateOfBirth: str(form, "dateOfBirth"),
      gender: str(form, "gender"),
      nationality: str(form, "nationality"),
      homeLanguage: str(form, "homeLanguage"),
      phone,
      email,
      residentialAddress: str(form, "residentialAddress"),
      postalAddress: str(form, "postalAddress"),
      guardianName: str(form, "guardianName"),
      guardianRelationship: str(form, "guardianRelationship"),
      guardianPhone: str(form, "guardianPhone"),
      guardianEmail: str(form, "guardianEmail"),
      guardianOccupation: str(form, "guardianOccupation"),
      school: str(form, "school"),
      highestQualification: str(form, "highestQualification"),
      yearCompleted: str(form, "yearCompleted"),
      docId,
      docResults,
      docResidence,
      docFee,
      status: "Pending" as const,
    };

    await Application.create(application);
    await Promise.all([
      notifyNewApplication(application),
      confirmApplicationReceived(application),
    ]);

    return NextResponse.json({
      ok: true,
      reference: application.reference,
      emailed: !!email,
      message: "Application submitted successfully. We will contact you soon.",
    });
  } catch (err) {
    console.error("POST /api/public/apply", err);
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 });
  }
}
