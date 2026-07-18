export interface Course {
  _id: string;
  name: string;
  category: string;
  duration: string;
  fee: number;
  feeUnit: string;
  level: string;
  description: string;
  image: string;
  active: boolean;
}

export type ApplicationStatus = "Pending" | "Contacted" | "Registered";

export interface Application {
  _id: string;
  course: string;
  campus: string;
  // Personal
  fullName: string;
  idNumber: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  homeLanguage: string;
  // Contact
  phone: string;
  email: string;
  residentialAddress: string;
  postalAddress: string;
  // Guardian
  guardianName: string;
  guardianRelationship: string;
  guardianPhone: string;
  guardianEmail: string;
  guardianOccupation: string;
  // Academic
  school: string;
  highestQualification: string;
  yearCompleted: string;
  // Documents
  docId: string;
  docResults: string;
  docResidence: string;
  docFee: string;
  status: ApplicationStatus;
  createdAt: string;
}

export interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface Banner {
  title: string;
  active: boolean;
}

export interface SiteSettings {
  schoolName: string;
  regNo: string;
  tagline: string;
  email: string;
  phone1: string;
  phone2: string;
  phone3: string;
  whatsapp: string;
  campus1: string;
  campus2: string;
  facebook: string;
  instagram: string;
  accreditation: string;
  established: string;
  mission: string;
  vision: string;
  heroTitle: string;
  heroSubtitle: string;
  heroText: string;
  whyChoose: string[];
  banners: Banner[];
}

export interface Stats {
  totals: {
    applications: number;
    newThisMonth: number;
    courses: number;
    registered: number;
  };
  byStatus: { Pending: number; Contacted: number; Registered: number };
  monthly: number[];
}
