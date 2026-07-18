import {
  Cog,
  BarChart3,
  Laptop,
  Zap,
  Truck,
  Wrench,
  ClipboardCheck,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";

/** Lucide icon per course category. */
const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  "Engineering Studies": Cog,
  "Management Programmes": BarChart3,
  "Computer Short Courses": Laptop,
  "Specialised Electrical Skills": Zap,
  "Mining & Construction": Truck,
  "Artisan Practical Skills": Wrench,
  "Trade Test Preparation": ClipboardCheck,
  "Extra Classes (FET)": GraduationCap,
};

export function categoryIcon(category: string): LucideIcon {
  return CATEGORY_ICON_MAP[category] || GraduationCap;
}

export function CategoryIcon({ category, className }: { category: string; className?: string }) {
  const Icon = categoryIcon(category);
  return <Icon className={className} />;
}
