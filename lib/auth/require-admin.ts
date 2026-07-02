import { redirect } from "next/navigation";
import { getUserRole } from "./get-user-role";

export async function requireAdmin() {
  const { user, role } = await getUserRole();

  if (!user) {
    redirect("/auth/login");
  }

  const normalizedRole = role?.toLowerCase().replace(/_/g, "-");
  if (normalizedRole !== "admin" && normalizedRole !== "super-admin") {
    redirect("/portal");
  }

  return { user, role };
}