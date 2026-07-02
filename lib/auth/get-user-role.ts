import { createServerSupabaseClient } from "./server-auth";

export async function getUserRole() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, role: null, profile: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, avatar_url")
    .eq("id", user.id)
    .single();

  return {
    user,
    role: profile?.role ?? "client",
    profile,
  };
}
