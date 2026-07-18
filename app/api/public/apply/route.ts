import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { connectDB } from "@/lib/mongodb";
import { Application } from "@/lib/models/Application";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { notifyNewApplication } from "@/lib/email";

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

const str = (form: FormData, key: string) => String(form.get(key) || "").trim();

// Submit a course application (multipart form; several optional document uploads).
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const form = await req.formData();

    const fullName = str(form, "fullName");
    const phone = str(form, "phone");
    const course = str(form, "course");

    if (!fullName || !phone || !course) {
      return NextResponse.json(
        { error: "Full name, cell phone and course are required." },
        { status: 400 }
      );
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
      course,
      campus: str(form, "campus"),
      fullName,
      idNumber: str(form, "idNumber"),
      dateOfBirth: str(form, "dateOfBirth"),
      gender: str(form, "gender"),
      nationality: str(form, "nationality"),
      homeLanguage: str(form, "homeLanguage"),
      phone,
      email: str(form, "email"),
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
    await notifyNewApplication(application);

    return NextResponse.json({
      ok: true,
      message: "Application submitted successfully. We will contact you soon.",
    });
  } catch (err) {
    console.error("POST /api/public/apply", err);
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 });
  }
}
