import { z } from "zod";

/** Trimmed, lower-cased email (the one normalisation used everywhere). */
export const emailSchema = z.string().trim().toLowerCase().pipe(z.email().max(254));

export const requestCodeSchema = z.object({ email: emailSchema });

export const codeLoginSchema = z.object({
  email: emailSchema,
  code: z.string().trim().regex(/^\d{6}$/),
});

export const passwordLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1).max(72), // bcrypt only uses the first 72 bytes
});
