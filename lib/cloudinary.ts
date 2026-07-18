import { v2 as cloudinary } from "cloudinary";

const CLOUD = process.env.CLOUDINARY_CLOUD_NAME;
const KEY = process.env.CLOUDINARY_API_KEY;
const SECRET = process.env.CLOUDINARY_API_SECRET;

let configured = false;
function ensureConfigured(): boolean {
  if (!CLOUD || !KEY || !SECRET) return false;
  if (!configured) {
    cloudinary.config({ cloud_name: CLOUD, api_key: KEY, api_secret: SECRET, secure: true });
    configured = true;
  }
  return true;
}

export function isCloudinaryEnabled(): boolean {
  return !!(CLOUD && KEY && SECRET);
}

/**
 * Upload a file buffer to Cloudinary. Returns the secure URL, or null if
 * Cloudinary is not configured (caller should fall back to local storage).
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  filename: string,
  folder = "shalom/applications"
): Promise<string | null> {
  if (!ensureConfigured()) return null;

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
        public_id: `${Date.now()}-${filename.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9._-]/g, "_")}`,
      },
      (error, result) => {
        if (error || !result) return reject(error || new Error("Upload failed"));
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}
