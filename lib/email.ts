import { Resend } from "resend";

const API_KEY = process.env.RESEND_API_KEY;
const FROM = process.env.FROM_EMAIL || "onboarding@resend.dev";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

const resend = API_KEY ? new Resend(API_KEY) : null;

const SCHOOL = "Shalom Training School";
const BRAND = "#0a1a3c";
const GREEN = "#35b233";

function shell(title: string, rows: [string, string][], intro: string) {
  const cells = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px;color:#64748b;font-weight:600;white-space:nowrap">${k}</td>
         <td style="padding:6px 12px;color:#16233d">${v || "—"}</td></tr>`
    )
    .join("");
  return `
  <div style="font-family:Segoe UI,Arial,sans-serif;max-width:560px;margin:auto;border:1px solid #e4e8f0;border-radius:12px;overflow:hidden">
    <div style="background:${BRAND};padding:20px 24px;color:#fff">
      <div style="font-size:18px;font-weight:800">${SCHOOL}</div>
      <div style="font-size:12px;color:${GREEN};letter-spacing:2px">TRAINING SCHOOL</div>
    </div>
    <div style="padding:24px">
      <h2 style="margin:0 0 4px;color:${BRAND}">${title}</h2>
      <p style="color:#64748b;margin:0 0 16px">${intro}</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px">${cells}</table>
    </div>
    <div style="background:#f4f6fb;padding:12px 24px;color:#94a3b8;font-size:12px">
      Automated notification from your website admin.
    </div>
  </div>`;
}

/** True when Resend + an admin recipient are configured. */
export function isEmailEnabled(): boolean {
  return !!(resend && ADMIN_EMAIL);
}

async function send(subject: string, html: string) {
  if (!resend || !ADMIN_EMAIL) {
    console.warn("Email skipped: RESEND_API_KEY or ADMIN_EMAIL not set.");
    return;
  }
  try {
    const { data, error } = await resend.emails.send({ from: FROM, to: ADMIN_EMAIL, subject, html });
    // The Resend SDK returns API errors in `error` rather than throwing.
    if (error) console.error("Resend email error:", error);
    else console.log("Email sent:", data?.id);
  } catch (err) {
    // Never let email failure break the request.
    console.error("Resend email failed:", err);
  }
}

export async function notifyNewApplication(a: {
  fullName: string;
  phone: string;
  email?: string;
  course: string;
  campus?: string;
  idNumber?: string;
}) {
  await send(
    `New Application: ${a.fullName} — ${a.course}`,
    shell("New Course Application", [
      ["Name", a.fullName],
      ["ID / Passport", a.idNumber || ""],
      ["Cell Phone", a.phone],
      ["Email", a.email || ""],
      ["Course", a.course],
      ["Campus", a.campus || ""],
    ], "A new application was submitted on the website. Open the admin dashboard to view full details and documents.")
  );
}

export async function notifyNewMessage(m: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  await send(
    `New Message: ${m.subject} — ${m.name}`,
    shell("New Contact Message", [
      ["Name", m.name],
      ["Email", m.email],
      ["Subject", m.subject],
      ["Message", m.message],
    ], "A new contact message was submitted on the website.")
  );
}
