// Full course catalogue for Shalom Training School SA.
// Prices/categories transcribed from the official course & fees list.

export interface SeedCourse {
  name: string;
  category: string;
  fee: number;
  feeUnit: string;
  duration: string;
  level: string;
  description: string;
}

export const SEED_COURSES: SeedCourse[] = [
  // --- Engineering Studies (N4–N6) ---
  { category: "Engineering Studies", name: "Electrical Engineering (N4–N6)", fee: 800, feeUnit: "per subject / month", duration: "3 months per N level", level: "N4–N6", description: "Mathematics, Engineering Science, Electro Technology, Industrial Electronics, Power Machines, Fault Finding & P&D." },
  { category: "Engineering Studies", name: "Mechanical Engineering (N4–N6)", fee: 800, feeUnit: "per subject / month", duration: "3 months per N level", level: "N4–N6", description: "Mathematics, Engineering Science, Mechanotechnics, Mechanical Drawing & Design." },
  { category: "Engineering Studies", name: "Civil Engineering (N4–N6)", fee: 800, feeUnit: "per subject / month", duration: "3 days / week", level: "N4–N6", description: "Mathematics, Engineering Science, Building & Structural Construction, Surveying, Building & Structural Surveying, Production & Quality Control." },

  // --- Management Programmes (N4–N6) ---
  { category: "Management Programmes", name: "Financial Management (N4–N6)", fee: 800, feeUnit: "per subject / month", duration: "6 months per N level", level: "N4–N6", description: "Entrepreneurship & Business Management, Cost & Management Accounting, Financial Accounting, Computerised Financial Systems." },
  { category: "Management Programmes", name: "Business Management (N4–N6)", fee: 800, feeUnit: "per subject / month", duration: "6 months per N level", level: "N4–N6", description: "Entrepreneurship & Business Management, Management Communication, Financial Accounting, Computer Practice." },
  { category: "Management Programmes", name: "Marketing Management (N4–N6)", fee: 800, feeUnit: "per subject / month", duration: "6 months per N level", level: "N4–N6", description: "Marketing Management, Marketing Communication, Sales Management, Marketing Research." },
  { category: "Management Programmes", name: "Human Resource Management (N4–N6)", fee: 800, feeUnit: "per subject / month", duration: "6 months per N level", level: "N4–N6", description: "Personnel Management, Management Communication, Labour Relations, Computer Practice." },
  { category: "Management Programmes", name: "Public Relations (N4–N6)", fee: 800, feeUnit: "per subject / month", duration: "6 months per N level", level: "N4–N6", description: "Communication, Office Practice, Information Processing." },
  { category: "Management Programmes", name: "Management Assistant (N4–N6)", fee: 800, feeUnit: "per subject / month", duration: "6 months per N level", level: "N4–N6", description: "Communication, Office Practice, Information Processing, Computer Practice." },

  // --- Computer Short Courses ---
  { category: "Computer Short Courses", name: "Computer Studies", fee: 3000, feeUnit: "per course", duration: "2 months • 3 days / week", level: "Short Course", description: "Full computer literacy foundation programme." },
  { category: "Computer Short Courses", name: "MS Word", fee: 3000, feeUnit: "per course", duration: "2 months • 3 days / week", level: "Short Course", description: "Microsoft Word document processing." },
  { category: "Computer Short Courses", name: "MS Excel", fee: 3000, feeUnit: "per course", duration: "2 months • 3 days / week", level: "Short Course", description: "Microsoft Excel spreadsheets and formulas." },
  { category: "Computer Short Courses", name: "MS PowerPoint", fee: 3000, feeUnit: "per course", duration: "2 months • 3 days / week", level: "Short Course", description: "Presentation design with PowerPoint." },
  { category: "Computer Short Courses", name: "Computer Technician", fee: 3000, feeUnit: "per course", duration: "2 months • 3 days / week", level: "Short Course", description: "Hardware maintenance and repair." },
  { category: "Computer Short Courses", name: "A+ PC Technician", fee: 3000, feeUnit: "per course", duration: "2 months • 3 days / week", level: "Short Course", description: "CompTIA A+ aligned PC technician skills." },
  { category: "Computer Short Courses", name: "Graphic Design", fee: 3000, feeUnit: "per course", duration: "2 months • 3 days / week", level: "Short Course", description: "Design fundamentals and industry tools." },
  { category: "Computer Short Courses", name: "Data Capture", fee: 3000, feeUnit: "per course", duration: "2 months • 3 days / week", level: "Short Course", description: "Accurate, fast data capturing skills." },
  { category: "Computer Short Courses", name: "Internet & Email", fee: 3000, feeUnit: "per course", duration: "2 months • 3 days / week", level: "Short Course", description: "Practical internet and email usage." },

  // --- Specialised Electrical Skills Training ---
  { category: "Specialised Electrical Skills", name: "Instrumentation Practical Skills", fee: 8000, feeUnit: "per course", duration: "6–8 weeks • 3 days / week", level: "Specialised", description: "Hands-on instrumentation practical training." },
  { category: "Specialised Electrical Skills", name: "Industrial Electronics", fee: 8000, feeUnit: "per course", duration: "6–8 weeks • 3 days / week", level: "Specialised", description: "Industrial electronics systems and applications." },
  { category: "Specialised Electrical Skills", name: "Service & Maintenance of PLC", fee: 8000, feeUnit: "per course", duration: "6–8 weeks • 3 days / week", level: "Specialised", description: "PLC service and preventive maintenance." },
  { category: "Specialised Electrical Skills", name: "PLC Programming", fee: 8000, feeUnit: "per course", duration: "6–8 weeks • 3 days / week", level: "Specialised", description: "Programmable Logic Controller programming." },
  { category: "Specialised Electrical Skills", name: "PLC Troubleshooting", fee: 8000, feeUnit: "per course", duration: "6–8 weeks • 3 days / week", level: "Specialised", description: "Diagnosing and fixing PLC faults." },

  // --- Mining & Construction Short Courses ---
  { category: "Mining & Construction", name: "Dump Truck", fee: 4800, feeUnit: "per course", duration: "2 weeks", level: "Machinery", description: "Heavy machinery: Dump Truck operation." },
  { category: "Mining & Construction", name: "TLB", fee: 4800, feeUnit: "per course", duration: "2 weeks", level: "Machinery", description: "Tractor Loader Backhoe operation." },
  { category: "Mining & Construction", name: "Front End Loader (FEL)", fee: 3800, feeUnit: "per course", duration: "2 weeks", level: "Machinery", description: "Front End Loader operation." },
  { category: "Mining & Construction", name: "Excavator", fee: 5500, feeUnit: "per course", duration: "2 weeks", level: "Machinery", description: "Excavator operation." },
  { category: "Mining & Construction", name: "Grader", fee: 3800, feeUnit: "per course", duration: "2 weeks", level: "Machinery", description: "Grader operation." },
  { category: "Mining & Construction", name: "Forklift", fee: 2500, feeUnit: "per course", duration: "2 weeks", level: "Machinery", description: "Forklift operation." },
  { category: "Mining & Construction", name: "Roller Compactor", fee: 4000, feeUnit: "per course", duration: "2 weeks", level: "Machinery", description: "Roller Compactor operation." },
  { category: "Mining & Construction", name: "Bobcat", fee: 2500, feeUnit: "per course", duration: "2 weeks", level: "Machinery", description: "Bobcat operation." },
  { category: "Mining & Construction", name: "Bulldozer", fee: 3800, feeUnit: "per course", duration: "2 weeks", level: "Machinery", description: "Bulldozer operation." },
  { category: "Mining & Construction", name: "LHD Scoop", fee: 5500, feeUnit: "per course", duration: "2 weeks", level: "Mining", description: "Additional mining skill: LHD Scoop." },
  { category: "Mining & Construction", name: "Drill Rig (NQF L2)", fee: 5500, feeUnit: "per course", duration: "2 weeks", level: "Mining", description: "Additional mining skill: Drill Rig, NQF Level 2." },
  { category: "Mining & Construction", name: "Blasting Assistant", fee: 10000, feeUnit: "per course", duration: "2 weeks", level: "Mining", description: "Additional mining skill: Blasting Assistant." },

  // --- Artisan & Semi-Skills Programmes (N1–N3) ---
  { category: "Artisan Practical Skills", name: "Shield Metal Arc Welding (Mild Steel)", fee: 9500, feeUnit: "per programme", duration: "2–6 months", level: "N1–N3", description: "Welding & Metalwork practical skills." },
  { category: "Artisan Practical Skills", name: "Shield Metal Arc Welding (Stainless Steel)", fee: 9500, feeUnit: "per programme", duration: "2–6 months", level: "N1–N3", description: "Welding & Metalwork practical skills." },
  { category: "Artisan Practical Skills", name: "MIG Welding (Mild Steel)", fee: 9500, feeUnit: "per programme", duration: "2–6 months", level: "N1–N3", description: "Welding & Metalwork practical skills." },
  { category: "Artisan Practical Skills", name: "TIG Welding (Mild Steel)", fee: 9500, feeUnit: "per programme", duration: "2–6 months", level: "N1–N3", description: "Welding & Metalwork practical skills." },
  { category: "Artisan Practical Skills", name: "CO₂ Welding (Mild Steel)", fee: 9500, feeUnit: "per programme", duration: "2–6 months", level: "N1–N3", description: "Welding & Metalwork practical skills." },
  { category: "Artisan Practical Skills", name: "CO₂ & TIG Welding (Aluminium)", fee: 9500, feeUnit: "per programme", duration: "2–6 months", level: "N1–N3", description: "Welding & Metalwork practical skills." },
  { category: "Artisan Practical Skills", name: "Auto Electrician Assistant", fee: 9500, feeUnit: "per programme", duration: "2–6 months", level: "N1–N3", description: "Mechanical & Technical practical skills." },
  { category: "Artisan Practical Skills", name: "Engine Mechanic", fee: 9500, feeUnit: "per programme", duration: "2–6 months", level: "N1–N3", description: "Mechanical & Technical practical skills." },
  { category: "Artisan Practical Skills", name: "Boiler-Maker Assistant", fee: 9500, feeUnit: "per programme", duration: "2–6 months", level: "N1–N3", description: "Mechanical & Technical practical skills." },
  { category: "Artisan Practical Skills", name: "Diesel Mechanic", fee: 9500, feeUnit: "per programme", duration: "2–6 months", level: "N1–N3", description: "Mechanical & Technical practical skills." },
  { category: "Artisan Practical Skills", name: "Assistant Motor Mechanic", fee: 9500, feeUnit: "per programme", duration: "2–6 months", level: "N1–N3", description: "Mechanical & Technical practical skills." },
  { category: "Artisan Practical Skills", name: "Machining & Assembly Techniques", fee: 9500, feeUnit: "per programme", duration: "2–6 months", level: "N1–N3", description: "Mechanical & Technical practical skills." },
  { category: "Artisan Practical Skills", name: "Machine & Equipment Maintenance", fee: 9500, feeUnit: "per programme", duration: "2–6 months", level: "N1–N3", description: "Mechanical & Technical practical skills." },
  { category: "Artisan Practical Skills", name: "Manual Lifting Equipment Operator", fee: 9500, feeUnit: "per programme", duration: "2–6 months", level: "N1–N3", description: "Mechanical & Technical practical skills." },
  { category: "Artisan Practical Skills", name: "Electrical Practical Skills", fee: 9500, feeUnit: "per programme", duration: "2–6 months", level: "N1–N3", description: "Electrical practical skills." },
  { category: "Artisan Practical Skills", name: "Basic Wiring & Installation", fee: 9500, feeUnit: "per programme", duration: "2–6 months", level: "N1–N3", description: "Electrical practical skills." },
  { category: "Artisan Practical Skills", name: "Fault Finding", fee: 9500, feeUnit: "per programme", duration: "2–6 months", level: "N1–N3", description: "Electrical practical skills." },

  // --- Trade Test Preparation ---
  { category: "Trade Test Preparation", name: "Trade Test Preparation — Welding", fee: 7000, feeUnit: "per course", duration: "Flexible", level: "Trade Test", description: "Preparation for the Welding trade test." },
  { category: "Trade Test Preparation", name: "Trade Test Preparation — Electrical", fee: 7000, feeUnit: "per course", duration: "Flexible", level: "Trade Test", description: "Preparation for the Electrical trade test." },
  { category: "Trade Test Preparation", name: "Trade Test Preparation — Plumbing", fee: 7000, feeUnit: "per course", duration: "Flexible", level: "Trade Test", description: "Preparation for the Plumbing trade test." },
  { category: "Trade Test Preparation", name: "Trade Test Preparation — Diesel Mechanic", fee: 7000, feeUnit: "per course", duration: "Flexible", level: "Trade Test", description: "Preparation for the Diesel Mechanic trade test." },

  // --- Extra Class Programmes (FET Grades 4–12) ---
  { category: "Extra Classes (FET)", name: "FET Subjects (Grades 4–12)", fee: 750, feeUnit: "per subject / month", duration: "3 days / week", level: "Grades 4–12", description: "English, Afrikaans, Accounting, Economics, Business Studies, Mathematics, Mathematical Literacy, Life Sciences, Geography, Physical Sciences, Tourism, CAT." },
];

export const CATEGORY_ORDER = [
  "Engineering Studies",
  "Management Programmes",
  "Artisan Practical Skills",
  "Mining & Construction",
  "Specialised Electrical Skills",
  "Computer Short Courses",
  "Trade Test Preparation",
  "Extra Classes (FET)",
];
