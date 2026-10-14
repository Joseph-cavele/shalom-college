import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  // Database-checked, so a stale cookie for a disabled account stays on this page.
  if (await getSession()) redirect("/admin");
  return <LoginForm />;
}
