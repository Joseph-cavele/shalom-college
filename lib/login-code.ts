import { createHmac, randomInt, timingSafeEqual } from "crypto";
import { connectDB } from "@/lib/mongodb";
import { LoginCode } from "@/lib/models/LoginCode";

export const CODE_TTL_MS = 10 * 60 * 1000; // a code lives for 10 minutes
export const MAX_ATTEMPTS = 5; // wrong guesses allowed per code
export const RESEND_COOLDOWN_MS = 60 * 1000; // minimum gap between codes for one email

function hmacKey(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is not set");
  return `login-code:${secret}`;
}

/** HMAC-SHA256 of the code, bound to the email so a hash can't be reused for another account. */
export function hashCode(email: string, code: string): string {
  return createHmac("sha256", hmacKey()).update(`${email}:${code}`).digest("hex");
}

/**
 * Issue a fresh six-digit code for `email`, replacing any earlier one.
 * Returns the plaintext code (to email, never to store or log), or null when
 * a code was issued less than RESEND_COOLDOWN_MS ago.
 */
export async function issueLoginCode(email: string): Promise<string | null> {
  await connectDB();
  await LoginCode.init(); // make sure the unique + TTL indexes exist
  const code = randomInt(0, 1_000_000).toString().padStart(6, "0");
  const now = new Date();
  try {
    // Matches only a code that is past its cooldown (or none at all → insert).
    // A recent code makes the upsert collide on the unique email → cooldown.
    await LoginCode.findOneAndUpdate(
      { email, createdAt: { $lte: new Date(now.getTime() - RESEND_COOLDOWN_MS) } },
      {
        $set: {
          codeHash: hashCode(email, code),
          expiresAt: new Date(now.getTime() + CODE_TTL_MS),
          attempts: 0,
          createdAt: now,
        },
      },
      { upsert: true }
    );
  } catch (err) {
    if ((err as { code?: number }).code === 11000) return null;
    throw err;
  }
  return code;
}

/**
 * Check a submitted code. Each call atomically uses up one attempt before
 * comparing, so parallel guesses can't exceed MAX_ATTEMPTS; a correct code is
 * deleted in the same step that accepts it, so it can only be redeemed once.
 */
export async function verifyLoginCode(email: string, code: string): Promise<boolean> {
  await connectDB();
  const doc = await LoginCode.findOneAndUpdate(
    { email, expiresAt: { $gt: new Date() }, attempts: { $lt: MAX_ATTEMPTS } },
    { $inc: { attempts: 1 } },
    { new: true, lean: true }
  );
  if (!doc) return false;
  const stored = doc as unknown as { _id: unknown; codeHash: string; attempts: number };

  const matches = timingSafeEqual(Buffer.from(stored.codeHash, "hex"), Buffer.from(hashCode(email, code), "hex"));
  if (!matches) {
    if (stored.attempts >= MAX_ATTEMPTS) await LoginCode.deleteOne({ _id: stored._id, codeHash: stored.codeHash });
    return false;
  }
  // Only the request that actually deletes the code wins (guards concurrent redemption).
  const { deletedCount } = await LoginCode.deleteOne({ _id: stored._id, codeHash: stored.codeHash });
  return deletedCount === 1;
}
