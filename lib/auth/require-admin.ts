import { redirect } from "next/navigation";
import { getUserRole } from "./get-user-role";

export async function requireAdmin() {
  const { user, role } = await getUserRole();

  if (!user) {
    redirect("/auth/login");
  }

  if (role !== "admin" && role !== "super-admin") {
    redirect("/portal");
  }

  return { user, role };
}