import { cache } from "react";
import { createServerSupabaseClient } from "./server-auth";
import { getEffectiveRole, isDevAdminEmail } from "./role";

export const getUserRole = cache(async () => {
  const startTime = Date.now();
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, role: null, profile: null };

  // If user is dev admin, resolve role immediately without additional DB query
  if (isDevAdminEmail(user.email)) {
    console.log(`[getUserRole] Fast-path dev admin ${user.email} (${Date.now() - startTime}ms)`);
    return {
      user,
      role: "super-admin",
      profile: { role: "super-admin", full_name: "Dev Admin", avatar_url: null },
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, avatar_url")
    .eq("id", user.id)
    .single();

  const role = getEffectiveRole(profile?.role, user.email);

  console.log(`[getUserRole] Profile fetched for ${user.email} (${Date.now() - startTime}ms)`);

  return {
    user,
    role,
    profile,
  };
});
