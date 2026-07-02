import { createClient } from "@/lib/supabase/server";
import { AppError } from "./errors";

export interface AuthenticatedUser {
  id: string;
  email?: string;
  role: string;
  fullName?: string;
  avatarUrl?: string;
}

export async function requireUser(): Promise<AuthenticatedUser> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    throw new AppError("Authentication required to perform this action", "UNAUTHENTICATED", 401);
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, full_name, avatar_url")
    .eq("id", user.id)
    .single();

  const devAdminEmail = process.env.NEXT_PUBLIC_DEV_ADMIN_EMAIL || process.env.DEV_ADMIN_EMAIL;
  let defaultRole = "client";
  if (user.email && devAdminEmail && user.email.toLowerCase() === devAdminEmail.toLowerCase()) {
    defaultRole = "super-admin";
  }

  if (profileError || !profile) {
    // If user exists in Auth but profiles table fetch failed, default to 'client' role
    return {
      id: user.id,
      email: user.email,
      role: defaultRole,
    };
  }

  return {
    id: user.id,
    email: user.email,
    role: (user.email && devAdminEmail && user.email.toLowerCase() === devAdminEmail.toLowerCase()) ? "super-admin" : (profile.role || "client"),
    fullName: profile.full_name,
    avatarUrl: profile.avatar_url,
  };
}

export async function requireRoles(allowedRoles: string[]): Promise<AuthenticatedUser> {
  const user = await requireUser();
  
  const normalize = (r: string) => r.toLowerCase().replace(/_/g, "-");
  const normalizedUserRole = normalize(user.role);
  const normalizedAllowed = allowedRoles.map(normalize);

  if (!normalizedAllowed.includes(normalizedUserRole)) {
    throw new AppError(`Access denied. Allowed roles: [${allowedRoles.join(", ")}]. Current: [${user.role}]`, "UNAUTHORIZED", 403);
  }

  return user;
}

export async function getClientIpAndUserAgent() {
  // Safe helper to extract client IP and user agent headers in next.js
  try {
    const { headers } = await import("next/headers");
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown";
    const userAgent = headersList.get("user-agent") || "unknown";
    return { ip, userAgent };
  } catch {
    return { ip: "unknown", userAgent: "unknown" };
  }
}
