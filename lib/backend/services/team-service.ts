import { createClient } from "@/lib/supabase/server";
import { TeamRepository } from "../repositories/team-repository";
import { requireRoles, getClientIpAndUserAgent } from "../utils/auth";
import { teamMemberSchema, TeamMemberInputType } from "@/lib/validations/cms";
import { AuditRepository } from "../repositories/audit-repository";
import { AppError } from "../utils/errors";

export const TeamService = {
  async listTeamMembers() {
    const supabase = await createClient();
    return TeamRepository.listAll(supabase);
  },

  async createTeamMember(input: TeamMemberInputType) {
    const user = await requireRoles(["admin", "super-admin"]);
    const supabase = await createClient();

    // Input validation
    const parsed = teamMemberSchema.parse(input);

    const member = await TeamRepository.create(supabase, parsed);

    // Audit log
    const { ip, userAgent } = await getClientIpAndUserAgent();
    await AuditRepository.createSystemLog({
      user_id: user.id,
      action: "cms.team.create",
      entity_type: "team_member",
      entity_id: member.id,
      details: { name: member.name, role: member.role },
      ip_address: ip,
      user_agent: userAgent,
    });

    return member;
  },

  async updateTeamMember(id: string, input: Partial<TeamMemberInputType>) {
    const user = await requireRoles(["admin", "super-admin"]);
    const supabase = await createClient();

    // Verify exists
    const existing = await TeamRepository.findById(supabase, id);
    if (!existing) {
      throw new AppError("Team member not found", "NOT_FOUND", 404);
    }

    // Input validation
    const parsed = teamMemberSchema.partial().parse(input);

    const member = await TeamRepository.update(supabase, id, parsed);

    // Audit log
    const { ip, userAgent } = await getClientIpAndUserAgent();
    await AuditRepository.createSystemLog({
      user_id: user.id,
      action: "cms.team.update",
      entity_type: "team_member",
      entity_id: member.id,
      details: { name: member.name, changed_fields: Object.keys(parsed) },
      ip_address: ip,
      user_agent: userAgent,
    });

    return member;
  },

  async deleteTeamMember(id: string) {
    const user = await requireRoles(["admin", "super-admin"]);
    const supabase = await createClient();

    const existing = await TeamRepository.findById(supabase, id);
    if (!existing) {
      throw new AppError("Team member not found", "NOT_FOUND", 404);
    }

    await TeamRepository.delete(supabase, id);

    // Audit log
    const { ip, userAgent } = await getClientIpAndUserAgent();
    await AuditRepository.createSystemLog({
      user_id: user.id,
      action: "cms.team.delete",
      entity_type: "team_member",
      entity_id: id,
      details: { name: existing.name },
      ip_address: ip,
      user_agent: userAgent,
    });

    return true;
  }
};
