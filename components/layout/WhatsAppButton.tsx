import { FaWhatsapp } from "react-icons/fa6";
import { waLink } from "@/lib/utils";

/** Floating WhatsApp contact button. */
export function WhatsAppButton({ phone }: { phone: string }) {
  return (
    <a
      href={waLink(phone)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-[60] grid h-14 w-14 place-items-center
       rounded-full bg-[#25d366] text-white shadow-lg2 transition hover:scale-105"
    >
      <FaWhatsapp className="h-7 w-7" />
    </a>
  );
}
