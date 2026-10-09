import { Resend } from "resend";

const API_KEY = process.env.RESEND_API_KEY;
const FROM = process.env.FROM_EMAIL || "Shalom Training School <info@shalomtrainingschool.co.za>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

const resend = API_KEY ? new Resend(API_KEY) : null;

const SCHOOL = "Shalom Training School";
const BRAND = "#0a1a3c";
const GREEN = "#35b233";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Escape user-supplied text so it can't inject HTML or links into emails.
function esc(v: string) {
  return v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function shell(
  title: string,
  rows: [string, string][],
  intro: string,
  footer = "Automated notification from your website admin."
) {
  const cells = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px;color:#64748b;font-weight:600;white-space:nowrap">${esc(k)}</td>
         <td style="padding:6px 12px;color:#16233d">${v ? esc(v) : "—"}</td></tr>`
    )
    .join("");
  return `
  <div style="font-family:Segoe UI,Arial,sans-serif;max-width:560px;margin:auto;border:1px solid #e4e8f0;border-radius:12px;overflow:hidden">
    <div style="background:${BRAND};padding:20px 24px;color:#fff">
      <div style="font-size:18px;font-weight:800">${SCHOOL}</div>
      <div style="font-size:12px;color:${GREEN};letter-spacing:2px">TRAINING SCHOOL</div>
    </div>
    <div style="padding:24px">
      <h2 style="margin:0 0 4px;color:${BRAND}">${esc(title)}</h2>
      <p style="color:#64748b;margin:0 0 16px">${esc(intro)}</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px">${cells}</table>
    </div>
    <div style="background:#f4f6fb;padding:12px 24px;color:#94a3b8;font-size:12px">
      ${esc(footer)}
    </div>
  </div>`;
}

/** True when Resend + an admin recipient are configured. */
export function isEmailEnabled(): boolean {
  return !!(resend && ADMIN_EMAIL);
}

async function deliver(to: string, subject: string, html: string) {
  if (!resend) return;
  try {
    const { data, error } = await resend.emails.send({ from: FROM, to, subject, html });
    // The Resend SDK returns API errors in `error` rather than throwing.
    if (error) console.error("Resend email error:", error);
    else console.log("Email sent:", data?.id);
  } catch (err) {
    // Never let email failure break the request.
    console.error("Resend email failed:", err);
  }
}

/** Email the school owner (ADMIN_EMAIL). */
async function send(subject: string, html: string) {
  if (!resend || !ADMIN_EMAIL) {
    console.warn("Email skipped: RESEND_API_KEY or ADMIN_EMAIL not set.");
    return;
  }
  await deliver(ADMIN_EMAIL, subject, html);
}

/** Email an applicant; skipped when they gave no valid address. */
async function sendToApplicant(email: string | undefined, subject: string, html: string) {
  if (!resend) {
    console.warn("Applicant email skipped: RESEND_API_KEY not set.");
    return;
  }
  const to = (email || "").trim();
  if (!EMAIL_RE.test(to)) return;
  await deliver(to, subject, html);
}

const APPLICANT_FOOTER = `${SCHOOL} · Reply to this email if you have any questions.`;

export async function notifyNewApplication(a: {
  reference?: string;
  fullName: string;
  phone: string;
  email?: string;
  course: string;
  campus?: string;
  studyMode?: string;
  idNumber?: string;
}) {
  await send(
    `New Student Application: ${a.fullName} — ${a.course}`,
    shell("New Course Application", [
      ["Reference", a.reference || ""],
      ["Name", a.fullName],
      ["ID / Passport", a.idNumber || ""],
      ["Cell Phone", a.phone],
      ["Email", a.email || ""],
      ["Course", a.course],
      ["Study Mode", a.studyMode || ""],
      ["Campus", a.campus || ""],
    ], "A new application was submitted on the website. Open the admin dashboard to view full details and documents.")
  );
}

export async function notifyNewMessage(m: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  await send(
    `New Message: ${m.subject} — ${m.name}`,
    shell("New Contact Message", [
      ["Name", m.name],
      ["Email", m.email],
      ["Phone", m.phone || ""],
      ["Subject", m.subject],
      ["Message", m.message],
    ], "A new contact message was submitted on the website.")
  );
}

/** Confirmation to the applicant after they submit the form. */
export async function confirmApplicationReceived(a: {
  reference?: string;
  fullName: string;
  email?: string;
  course: string;
  campus?: string;
  studyMode?: string;
}) {
  await sendToApplicant(
    a.email,
    `Application Received — ${SCHOOL}`,
    shell(
      "Application Received",
      [
        ["Reference", a.reference || ""],
        ["Name", a.fullName],
        ["Course", a.course],
        ["Study Mode", a.studyMode || ""],
        ["Campus", a.campus || ""],
        ["Status", "Pending"],
      ],
      `Dear ${a.fullName}, thank you for applying to ${SCHOOL}. We have received your application and our team will contact you soon. Please quote your reference number if you contact us.`,
      APPLICANT_FOOTER
    )
  );
}

const STATUS_COPY: Record<string, { subject: string; intro: string }> = {
  Contacted: {
    subject: "Update on your application",
    intro:
      "Our team has reviewed your application and will be in touch shortly. Please keep your phone nearby, or reply to this email to discuss the next steps.",
  },
  Registered: {
    subject: "You're registered!",
    intro:
      "Congratulations! Your registration is confirmed. We will contact you with your start date and what to bring on your first day.",
  },
  Rejected: {
    subject: "Update on your application",
    intro:
      "Thank you for your interest. Unfortunately we are unable to accept your application at this time. You are welcome to contact us about other courses or future intakes.",
  },
};

/** Tell the applicant their status changed. Only Contacted / Registered / Rejected send an email. */
export async function notifyStatusChange(
  a: { fullName: string; email?: string; course: string },
  status: string
) {
  const copy = STATUS_COPY[status];
  if (!copy) return;
  await sendToApplicant(
    a.email,
    `${copy.subject} — ${SCHOOL}`,
    shell(
      `Application Status: ${status}`,
      [
        ["Name", a.fullName],
        ["Course", a.course],
        ["Status", status],
      ],
      `Dear ${a.fullName}, ${copy.intro}`,
      APPLICANT_FOOTER
    )
  );
}
