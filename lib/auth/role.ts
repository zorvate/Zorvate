export function normalizeRole(role?: string | null): string {
  if (!role) return "client";

  return role.trim().toLowerCase().replace(/_/g, "-");
}

export function isDevAdminEmail(email?: string | null): boolean {
  const devAdminEmail = process.env.NEXT_PUBLIC_DEV_ADMIN_EMAIL || process.env.DEV_ADMIN_EMAIL;

  return Boolean(email && devAdminEmail && email.toLowerCase() === devAdminEmail.toLowerCase());
}

export function getEffectiveRole(role?: string | null, email?: string | null): string {
  if (isDevAdminEmail(email)) {
    return "super-admin";
  }

  return normalizeRole(role);
}

export function getDashboardRoute(role?: string | null, email?: string | null): "/admin" | "/portal" {
  const effectiveRole = getEffectiveRole(role, email);

  return effectiveRole === "admin" || effectiveRole === "super-admin" ? "/admin" : "/portal";
}
