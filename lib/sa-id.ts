/**
 * South African ID number helpers (format: YYMMDD SSSS C A Z).
 * Shared by the application form (instant feedback) and the API (enforcement).
 */

export interface SaIdInfo {
  valid: boolean;
  /** ISO date, e.g. "1998-07-04" (only when valid). */
  dateOfBirth?: string;
  gender?: "Male" | "Female";
  /** "SA Citizen" or "Permanent Resident". */
  citizenship?: string;
}

/** True when the value looks like it is meant to be an SA ID (13 digits, spaces allowed). */
export function looksLikeSaId(value: string): boolean {
  return /^\d{13}$/.test(value.replace(/\s/g, ""));
}

export function parseSaId(raw: string): SaIdInfo {
  const id = raw.replace(/\s/g, "");
  if (!/^\d{13}$/.test(id)) return { valid: false };

  // Luhn checksum over all 13 digits.
  let sum = 0;
  for (let i = 0; i < 13; i++) {
    let d = Number(id[12 - i]);
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  if (sum % 10 !== 0) return { valid: false };

  const yy = Number(id.slice(0, 2));
  const mm = Number(id.slice(2, 4));
  const dd = Number(id.slice(4, 6));
  const nowYY = new Date().getFullYear() % 100;
  const year = yy > nowYY ? 1900 + yy : 2000 + yy;
  const date = new Date(Date.UTC(year, mm - 1, dd));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== mm - 1 || date.getUTCDate() !== dd) {
    return { valid: false };
  }

  const citizen = id[10];
  if (citizen !== "0" && citizen !== "1") return { valid: false };

  return {
    valid: true,
    dateOfBirth: date.toISOString().slice(0, 10),
    gender: Number(id.slice(6, 10)) < 5000 ? "Female" : "Male",
    citizenship: citizen === "0" ? "SA Citizen" : "Permanent Resident",
  };
}

/** SA cell/landline: 10 digits starting with 0, or +27 / 27 followed by 9 digits. */
export function isValidSaPhone(raw: string): boolean {
  const digits = raw.replace(/[\s()-]/g, "");
  return /^0\d{9}$/.test(digits) || /^\+?27\d{9}$/.test(digits);
}
