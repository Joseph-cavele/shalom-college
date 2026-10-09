import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Message } from "@/lib/models/Message";
import { notifyNewMessage } from "@/lib/email";

export const dynamic = "force-dynamic";

// Submit a contact-us message.
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const name = String(body.name || "").trim().slice(0, 100);
    const email = String(body.email || "").trim().slice(0, 200);
    const phone = String(body.phone || "").trim().slice(0, 30);
    const message = String(body.message || "").trim().slice(0, 5000);

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email and message are required." },
        { status: 400 }
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const subject = String(body.subject || "General Inquiry").trim().slice(0, 100) || "General Inquiry";
    await Message.create({ name, email, phone, subject, message, read: false });

    await notifyNewMessage({ name, email, phone, subject, message });

    return NextResponse.json({ ok: true, message: "Thank you! Your message has been sent." });
  } catch (err) {
    console.error("POST /api/public/contact", err);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
