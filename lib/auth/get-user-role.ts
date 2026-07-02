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

  const devAdminEmail = process.env.NEXT_PUBLIC_DEV_ADMIN_EMAIL || process.env.DEV_ADMIN_EMAIL;
  const role = (user.email && devAdminEmail && user.email.toLowerCase() === devAdminEmail.toLowerCase())
    ? "super-admin"
    : (profile?.role ?? "client");

  return {
    user,
    role,
    profile,
  };
}
