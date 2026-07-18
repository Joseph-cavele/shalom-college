import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** Authenticated admin shell wrapping all dashboard pages. */
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return <AdminShell fullName={session.fullName}>{children}</AdminShell>;
}
