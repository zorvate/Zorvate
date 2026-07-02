import { createClient } from "@/lib/supabase/server";
import { ProjectRepository, ProjectInput } from "../repositories/project-repository";
import { requireRoles, requireUser, getClientIpAndUserAgent } from "../utils/auth";
import { projectSchema } from "@/lib/validations/project";
import { AuditRepository } from "../repositories/audit-repository";
import { AppError } from "../utils/errors";

export const ProjectService = {
  async getProject(id: string) {
    const user = await requireUser();
    const supabase = await createClient();
    
    const project = await ProjectRepository.findById(supabase, id);
    if (!project) {
      throw new AppError("Project not found", "NOT_FOUND", 404);
    }

    // Authorization check: Client must own the project; other roles can view
    if (user.role === "client" && project.client_id !== user.id) {
      throw new AppError("Access denied. You do not own this project.", "UNAUTHORIZED", 403);
    }

    return project;
  },

  async listProjects() {
    const user = await requireUser();
    const supabase = await createClient();

    if (user.role === "client") {
      return ProjectRepository.listByClientId(supabase, user.id);
    }

    return ProjectRepository.listAll(supabase);
  },

  async createProject(input: ProjectInput) {
    const user = await requireRoles(["admin", "super-admin", "manager"]);
    const supabase = await createClient();

    // Input validation
    const parsed = projectSchema.parse(input);

    const project = await ProjectRepository.create(supabase, parsed);

    // Audit logging
    const { ip, userAgent } = await getClientIpAndUserAgent();
    await AuditRepository.createSystemLog({
      user_id: user.id,
      action: "project.create",
      entity_type: "project",
      entity_id: project.id,
      details: { name: project.name, client_id: project.client_id },
      ip_address: ip,
      user_agent: userAgent,
    });

    return project;
  },

  async updateProject(id: string, input: Partial<ProjectInput>) {
    const user = await requireRoles(["admin", "super-admin", "manager"]);
    const supabase = await createClient();

    // Verify exists
    const existing = await ProjectRepository.findById(supabase, id);
    if (!existing) {
      throw new AppError("Project not found", "NOT_FOUND", 404);
    }

    // Input validation (partial parse)
    const parsed = projectSchema.partial().parse(input);

    const project = await ProjectRepository.update(supabase, id, parsed);

    // Audit logging
    const { ip, userAgent } = await getClientIpAndUserAgent();
    await AuditRepository.createSystemLog({
      user_id: user.id,
      action: "project.update",
      entity_type: "project",
      entity_id: project.id,
      details: { changed_fields: Object.keys(parsed) },
      ip_address: ip,
      user_agent: userAgent,
    });

    return project;
  },

  async deleteProject(id: string) {
    const user = await requireRoles(["admin", "super-admin"]);
    const supabase = await createClient();

    // Verify exists
    const existing = await ProjectRepository.findById(supabase, id);
    if (!existing) {
      throw new AppError("Project not found", "NOT_FOUND", 404);
    }

    await ProjectRepository.delete(supabase, id);

    // Audit logging
    const { ip, userAgent } = await getClientIpAndUserAgent();
    await AuditRepository.createSystemLog({
      user_id: user.id,
      action: "project.delete",
      entity_type: "project",
      entity_id: id,
      details: { name: existing.name, client_id: existing.client_id },
      ip_address: ip,
      user_agent: userAgent,
    });

    return true;
  }
};
