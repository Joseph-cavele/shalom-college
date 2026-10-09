import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, access } from "fs/promises";
import { createHash } from "crypto";
import path from "path";
import { requireAuth } from "@/lib/guard";
import { uploadToCloudinary } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = Number(process.env.MAX_FILE_UPLOAD_SIZE) || 5 * 1024 * 1024;

// Admin image upload (e.g. course photos). Returns { url }.
export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  const form = await req.formData();
  const file = form.get("file");
  if (!file || typeof file !== "object" || !("arrayBuffer" in file) || file.size === 0) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image files are allowed." }, { status: 400 });
  }
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "Image exceeds the maximum file size (5MB)." }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  // Name the file after its contents so uploading the same image twice reuses one copy.
  const hash = createHash("sha256").update(bytes).digest("hex").slice(0, 24);

  const cloudUrl = await uploadToCloudinary(bytes, safe, "shalom/courses", hash).catch(() => null);
  if (cloudUrl) return NextResponse.json({ url: cloudUrl });

  // Fallback to local disk when Cloudinary is not configured.
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  const ext = path.extname(safe).toLowerCase() || ".jpg";
  const filename = `${hash}${ext}`;
  const target = path.join(uploadDir, filename);
  const exists = await access(target).then(() => true, () => false);
  if (!exists) await writeFile(target, bytes);
  return NextResponse.json({ url: `/uploads/${filename}` });
}
