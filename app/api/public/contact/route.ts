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
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const message = String(body.message || "").trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email and message are required." },
        { status: 400 }
      );
    }

    const subject = body.subject || "General Inquiry";
    await Message.create({ name, email, subject, message, read: false });

    await notifyNewMessage({ name, email, subject, message });

    return NextResponse.json({ ok: true, message: "Thank you! Your message has been sent." });
  } catch (err) {
    console.error("POST /api/public/contact", err);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
