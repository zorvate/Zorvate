import { createClient } from "./supabase-auth";

export async function logout() {
  const supabase = createClient();

  await supabase.auth.signOut();

  window.location.href = "/";
}