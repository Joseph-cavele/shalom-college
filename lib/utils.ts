/** Format a number as South African Rand. */
export function money(n: number | undefined | null): string {
  return "R" + Number(n || 0).toLocaleString("en-ZA");
}

/** Format an ISO date string as e.g. "24 Feb 2025". */
export function formatDate(value: string | Date | undefined | null): string {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** Merge conditional class names (tiny clsx). */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** Small deterministic hash so each course keeps the same photo across loads. */
function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) & 0xffff;
  return h;
}

/**
 * Keyword → local photos (in /public) for course cards. First matching rule
 * wins; multiple photos per rule are rotated deterministically per course so
 * sibling courses don't all share one image.
 */
const COURSE_IMAGE_RULES: [RegExp, string[]][] = [
  // Welding & metalwork (bright, clear welding close-up)
  [/weld/i, ["/pexels-felipe-silva-1458994757-27082729.jpg"]],
  [/boiler|machining|grind|metal/i, ["/pexels-lineartwork-12526764.jpg"]],
  // Mining & construction machinery
  [/dump truck/i, ["/pexels-rounak-kayal-183268922-33774180.jpg"]],
  [/excavator|tlb|loader|grader|forklift|roller|bobcat|bulldozer|lhd|drill|blasting/i, [
    "/pexels-pixabay-162639.jpg",
    "/pexels-robertkso-14484423.jpg",
  ]],
  // PLC / instrumentation / industrial electronics
  [/plc|instrumentation|industrial electronics/i, [
    "/pexels-philips-espinoza-1275989311-26100225.jpg",
    "/pexels-shameer-vayalakkad-hydrose-2602409-21812146.jpg",
  ]],
  // Electrical
  [/electric|wiring|fault/i, [
    "/pexels-prashik-narnaware-1004993-35154098.jpg",
    "/pexels-mickael-ange-konan-2156070331-34526423.jpg",
  ]],
  // Mechanical / motor trades
  [/diesel|engine(?!ering)|motor|mechanic(?!al engineering)|maintenance|lifting|assembly/i, [
    "/pexels-artempodrez-8986037.jpg",
    "/pexels-cottonbro-7565167.jpg",
    "/pexels-sejio402-29181492.jpg",
  ]],
  // Computer & IT
  [/technician|a\+/i, ["/pexels-multitech-institute-2151665718-31800980.jpg", "/pexels-karola-g-7286021.jpg"]],
  [/computer|word|excel|powerpoint|graphic|data|internet|email/i, [
    "/pexels-delot-18471488.jpg",
    "/pexels-dothanhyb-5530443.jpg",
  ]],
  // Management & office programmes
  [/management|marketing|financial|business|human resource|public relations|assistant/i, [
    "/pexels-thirdman-7654000.jpg",
    "/pexels-ai25studioai-6632536.jpg",
  ]],
  // Engineering studies: mechanical & electrical practical focus, civil = drawings
  [/mechanical engineering/i, ["/pexels-amar-11157438.jpg"]],
  [/civil|engineering/i, ["/pexels-shvetsa-5324968.jpg"]],
  [/fet|grade|subject|class/i, ["/extra-classes.jpg"]],
];

/** Topical local photo for a course card, keyword-matched on the course name. */
export function courseImage(name: string, category: string): string {
  for (const [re, imgs] of COURSE_IMAGE_RULES) {
    if (re.test(name)) return imgs[hashString(name) % imgs.length];
  }
  return CATEGORY_IMAGE_URL[category] || "/pexels-mikhail-nilov-9242175.jpg";
}

/** Curated local photos (in /public) used across the marketing site. */
export const IMAGES = {
  hero: "/pexels-solliefoto-320621.jpg", // welder at work
  whyChoose: "/pexels-mikhail-nilov-9242175.jpg", // hands-on practical training
  cta: "/pexels-cottonbro-7565167.jpg", // mechanic at workbench
};

/** Verified gallery photos. */
export const GALLERY = [
  "/pexels-mickael-ange-konan-2156070331-34526423.jpg", // electrical training
  "/pexels-felipe-silva-1458994757-27082729.jpg",       // welding
  "/pexels-delot-18471488.jpg",                          // computer lab
  "/pexels-robertkso-14484423.jpg",                      // heavy machinery
  "/pexels-sejio402-29181492.jpg",                       // mechanical / gearbox
  "/pexels-shameer-vayalakkad-hydrose-2602409-21812146.jpg", // electrical panel
  "/pexels-rounak-kayal-183268922-33774180.jpg",         // mining haul truck
  "/pexels-ai25studioai-6632536.jpg",                    // management / office
];

/** Hero background photo. */
export const HERO_IMAGE_URL = IMAGES.hero;

/** Category → local course/category image (used on category cards). */
export const CATEGORY_IMAGE_URL: Record<string, string> = {
  "Engineering Studies": "/pexels-shvetsa-5324968.jpg",
  "Mining & Construction": "/pexels-pixabay-162639.jpg",
  "Artisan Practical Skills": "/pexels-felipe-silva-1458994757-27082729.jpg",
  "Computer Short Courses": "/pexels-delot-18471488.jpg",
  "Management Programmes": "/pexels-thirdman-7654000.jpg",
  "Trade Test Preparation": "/pexels-omar-ramadan-1739260-6517339.jpg",
  "Extra Classes (FET)": "/extra-classes.jpg",
};

/** Build a WhatsApp deep link from a local SA number. */
export function waLink(phone: string): string {
  const digits = (phone || "").replace(/\D/g, "").replace(/^0/, "");
  return `https://wa.me/27${digits}`;
}

/**
 * Build a WhatsApp link that accepts either a local (0XX…) or an already
 * international (+27… / 27…) number, with an optional pre-filled message.
 */
export function whatsappLink(number: string, text?: string): string {
  let digits = (number || "").replace(/\D/g, "");
  if (digits.startsWith("0")) digits = "27" + digits.slice(1);
  const base = `https://wa.me/${digits}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
