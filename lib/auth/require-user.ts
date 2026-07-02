import { redirect } from "next/navigation";
import { getUserRole } from "./get-user-role";

export async function requireUser() {
  const { user } = await getUserRole();

  if (!user) {
    redirect("/auth/login");
  }

  return user;
}