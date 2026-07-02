import { createClient } from "@/lib/supabase/server";
import { ProfileRepository, ProfileUpdateInput } from "../repositories/profile-repository";
import { requireRoles, requireUser, getClientIpAndUserAgent } from "../utils/auth";
import { profileSchema } from "@/lib/validations/profile";
import { AuditRepository } from "../repositories/audit-repository";
import { AppError } from "../utils/errors";

export const ProfileService = {
  async getProfile(id: string) {
    const user = await requireUser();
    const supabase = await createClient();

    // Clients can only read their own profile; staff can read all
    if (user.role === "client" && user.id !== id) {
      throw new AppError("Access denied", "UNAUTHORIZED", 403);
    }

    const profile = await ProfileRepository.findById(supabase, id);
    if (!profile) {
      throw new AppError("Profile not found", "NOT_FOUND", 404);
    }
    return profile;
  },

  async listProfiles() {
    await requireRoles(["admin", "super-admin", "manager"]);
    const supabase = await createClient();
    return ProfileRepository.listAll(supabase);
  },

  async updateProfile(id: string, input: ProfileUpdateInput) {
    const user = await requireUser();
    const supabase = await createClient();

    // Verify ownership or staff permissions
    if (user.role === "client" && user.id !== id) {
      throw new AppError("Access denied", "UNAUTHORIZED", 403);
    }

    // Protect against non-admin changing role configuration
    if (input.role && input.role !== user.role && !["admin", "super-admin"].includes(user.role)) {
      throw new AppError("Access denied. Only administrators can alter user roles.", "UNAUTHORIZED", 403);
    }

    // Input validation
    const parsed = profileSchema.parse(input);

    const profile = await ProfileRepository.update(supabase, id, parsed);

    // Audit logging
    const { ip, userAgent } = await getClientIpAndUserAgent();
    await AuditRepository.createSystemLog({
      user_id: user.id,
      action: "profile.update",
      entity_type: "profile",
      entity_id: id,
      details: { changed_fields: Object.keys(parsed) },
      ip_address: ip,
      user_agent: userAgent,
    });

    return profile;
  }
};
