import { createHash } from "crypto";
import { connectDB } from "@/lib/mongodb";
import { RateLimit } from "@/lib/models/RateLimit";

/**
 * Fixed-window rate limiter backed by MongoDB, so limits hold across all
 * serverless instances. Returns true while the caller is within `limit`
 * requests per `windowSec`. Identifiers (emails, IPs) are hashed before storage.
 */
export async function rateLimit(bucket: string, identifier: string, limit: number, windowSec: number): Promise<boolean> {
  await connectDB();
  await RateLimit.init(); // make sure the unique + TTL indexes exist
  const windowMs = windowSec * 1000;
  const windowStart = Math.floor(Date.now() / windowMs) * windowMs;
  const id = createHash("sha256").update(identifier).digest("hex").slice(0, 32);
  const key = `${bucket}:${id}:${windowStart}`;

  // Two concurrent first hits can race on the upsert; the loser retries as an update.
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const doc = await RateLimit.findOneAndUpdate(
        { key },
        { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date(windowStart + windowMs) } },
        { upsert: true, new: true }
      ).lean<{ count: number }>();
      return (doc?.count ?? Infinity) <= limit;
    } catch (err) {
      if ((err as { code?: number }).code !== 11000) throw err;
    }
  }
  return false;
}

/** Client IP as reported by the platform proxy (Vercel sets these headers). */
export function clientIp(headers: Headers): string {
  return headers.get("x-forwarded-for")?.split(",")[0].trim() || headers.get("x-real-ip") || "unknown";
}
