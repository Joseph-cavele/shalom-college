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
  // Artisan trades — chosen to match the school's MERSETA flyer (Pexels, free licence)
  [/weld/i, [
    "/artisan-welding-pexels-5362681.jpg",
    "/pexels-felipe-silva-1458994757-27082729.jpg",
    "/pexels-solliefoto-320621.jpg",
    "/pexels-lineartwork-12526764.jpg",
  ]],
  [/boiler/i, ["/artisan-boiler-making-pexels-7461112.jpg"]],
  [/machining|fitt(er|ing)/i, ["/artisan-fitting-pexels-2995864.jpg"]],
  [/plumb/i, ["/artisan-plumbing-pexels-6419128.jpg"]],
  [/instrumentation/i, ["/artisan-instrumentation-pexels-2760241.jpg"]],
  [/grind|metal/i, ["/pexels-lineartwork-12526764.jpg"]],
  // Mining & construction machinery — one photo of each actual machine
  [/dump truck/i, [
    "/mining-dump-truck.jpg",
    "/mining-articulated-dump-truck.jpg",
    "/mining-articulated-dump-truck-2.jpg",
  ]],
  [/excavator/i, ["/mining-excavator.jpg"]],
  [/\btlb\b/i, ["/mining-tlb.jpg"]],
  [/front end loader|\bfel\b/i, ["/mining-front-end-loader.jpg"]],
  [/grader/i, ["/mining-grader.jpg"]],
  [/forklift/i, ["/mining-forklift.jpg"]],
  [/roller/i, ["/mining-roller-compactor.jpg"]],
  [/bobcat/i, ["/mining-bobcat.jpg"]],
  [/\blhd\b/i, ["/mining-lhd.jpg"]],
  [/drill rig|blasting/i, ["/mining-drill-rig.jpg"]],
  // (no bulldozer photo yet — falls back to the Mining & Construction category photo)
  // PLC / instrumentation / industrial electronics
  [/plc|instrumentation|industrial electronics/i, [
    "/pexels-philips-espinoza-1275989311-26100225.jpg",
    "/pexels-shameer-vayalakkad-hydrose-2602409-21812146.jpg",
  ]],
  // Electrical engineering (N4–N6) — owner's photo; artisan electrical courses below
  [/electrical engineering/i, ["/electrical-engineering.jpg"]],
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
    "/computer-lesson.jpg", // owner's photo: MS Office class
    "/pexels-delot-18471488.jpg",
    "/pexels-dothanhyb-5530443.jpg",
  ]],
  // Management programmes — a different photo for each course
  [/financial/i, ["/management-finance-pexels-33175649.jpg"]],
  [/marketing/i, ["/pexels-thirdman-7654000.jpg"]],
  [/human resource/i, ["/pexels-ai25studioai-6632536.jpg"]],
  [/public relations/i, ["/management-pr-pexels-33317197.jpg"]],
  [/management assistant|office assistant/i, ["/management-assistant-pexels-8691834.jpg"]],
  [/management|business/i, ["/management.jpg"]],
  // Engineering studies (electrical is matched above)
  [/mechanical engineering/i, ["/pexels-amar-11157438.jpg"]],
  [/civil/i, ["/civil-engineering.jpg"]],
  [/engineering/i, ["/pexels-shvetsa-5324968.jpg"]],
  // Extra classes: classroom on the course card, the student portrait on the category card
  [/fet|grade|subject|class/i, ["/extra-classes-classroom.jpg"]],
];

const FALLBACK_COURSE_IMAGE = "/pexels-mikhail-nilov-9242175.jpg";

/** Photo pool for a course: first keyword rule that matches, else its category photo. */
function imagePool(name: string, category: string): string[] {
  for (const [re, imgs] of COURSE_IMAGE_RULES) {
    if (re.test(name)) return imgs;
  }
  return [CATEGORY_IMAGE_URL[category] || FALLBACK_COURSE_IMAGE];
}

/** Topical local photo for a single course card, keyword-matched on the course name. */
export function courseImage(name: string, category: string): string {
  const imgs = imagePool(name, category);
  return imgs[hashString(name) % imgs.length];
}

/**
 * Fill in auto photos for a list of courses, rotating through each photo pool
 * in list order so courses sharing a pool get different photos instead of
 * several cards in a row showing the same one. Uploaded images are kept.
 */
export function withCourseImages<T extends { name: string; category: string; image?: string }>(
  courses: T[]
): T[] {
  const used = new Map<string[], number>();
  return courses.map((c) => {
    if (c.image) return c;
    const pool = imagePool(c.name, c.category);
    const n = used.get(pool) ?? 0;
    used.set(pool, n + 1);
    return { ...c, image: pool[n % pool.length] };
  });
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
  "/mining-tlb.jpg",                                     // heavy machinery (TLB)
  "/pexels-sejio402-29181492.jpg",                       // mechanical / gearbox
  "/pexels-shameer-vayalakkad-hydrose-2602409-21812146.jpg", // electrical panel
  "/mining-dump-truck.jpg",                              // mining haul truck
  "/management.jpg",                                     // management class
];

/** Hero background photo. */
export const HERO_IMAGE_URL = IMAGES.hero;

/** Category → local course/category image (used on category cards). */
export const CATEGORY_IMAGE_URL: Record<string, string> = {
  "Engineering Studies": "/pexels-shvetsa-5324968.jpg",
  "Mining & Construction": "/mining-front-end-loader.jpg",
  "Artisan Practical Skills": "/pexels-felipe-silva-1458994757-27082729.jpg",
  "Computer Short Courses": "/computer-lesson.jpg",
  "Management Programmes": "/management.jpg",
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
