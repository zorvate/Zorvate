import { createClient, createPublicClient } from "@/lib/supabase/server";
import { PortfolioRepository } from "../repositories/portfolio-repository";
import { requireRoles, requireUser, getClientIpAndUserAgent } from "../utils/auth";
import { portfolioProjectSchema, PortfolioProjectInputType } from "@/lib/validations/cms";
import { AuditRepository } from "../repositories/audit-repository";
import { AppError } from "../utils/errors";

export const PortfolioService = {
  async getProject(id: string) {
    const supabase = await createClient();
    const project = await PortfolioRepository.findById(supabase, id);
    if (!project) {
      throw new AppError("Portfolio project not found", "NOT_FOUND", 404);
    }
    return project;
  },

  async getProjectBySlug(slug: string) {
    const supabase = await createClient();
    const project = await PortfolioRepository.findBySlug(supabase, slug);
    if (!project) {
      throw new AppError("Portfolio project not found", "NOT_FOUND", 404);
    }
    return project;
  },

  async listProjects() {
    const supabase = await createClient();
    let projects = [];
    try {
      const user = await requireUser();
      const role = user.role.toLowerCase().replace(/_/g, "-");
      if (["admin", "super-admin", "manager"].includes(role)) {
        projects = await PortfolioRepository.listAllAdmin(supabase);
      } else {
        projects = await PortfolioRepository.listPublished(supabase);
      }
    } catch {
      projects = await PortfolioRepository.listPublished(supabase);
    }
    return projects || [];
  },

  async createProject(input: PortfolioProjectInputType) {
    const user = await requireRoles(["admin", "super-admin"]);
    const supabase = await createClient();

    // Input validation
    const parsed = portfolioProjectSchema.parse(input);

    // Verify slug uniqueness
    const existing = await PortfolioRepository.findBySlug(supabase, parsed.slug);
    if (existing) {
      throw new AppError("A portfolio project with this slug already exists", "DUPLICATE_SLUG", 409);
    }

    const project = await PortfolioRepository.create(supabase, parsed);

    // Audit log
    const { ip, userAgent } = await getClientIpAndUserAgent();
    await AuditRepository.createSystemLog({
      user_id: user.id,
      action: "cms.portfolio.create",
      entity_type: "portfolio_project",
      entity_id: project.id,
      details: { title: project.title, slug: project.slug, status: project.status },
      ip_address: ip,
      user_agent: userAgent,
    });

    return project;
  },

  async updateProject(id: string, input: Partial<PortfolioProjectInputType>) {
    const user = await requireRoles(["admin", "super-admin"]);
    const supabase = await createClient();

    // Verify exists
    const existing = await PortfolioRepository.findById(supabase, id);
    if (!existing) {
      throw new AppError("Portfolio project not found", "NOT_FOUND", 404);
    }

    // Input validation
    const parsed = portfolioProjectSchema.partial().parse(input);

    // Verify slug uniqueness if slug changed
    if (parsed.slug && parsed.slug !== existing.slug) {
      const duplicate = await PortfolioRepository.findBySlug(supabase, parsed.slug);
      if (duplicate) {
        throw new AppError("A portfolio project with this slug already exists", "DUPLICATE_SLUG", 409);
      }
    }

    const project = await PortfolioRepository.update(supabase, id, parsed);

    // Audit log
    const { ip, userAgent } = await getClientIpAndUserAgent();
    await AuditRepository.createSystemLog({
      user_id: user.id,
      action: "cms.portfolio.update",
      entity_type: "portfolio_project",
      entity_id: project.id,
      details: { title: project.title, changed_fields: Object.keys(parsed) },
      ip_address: ip,
      user_agent: userAgent,
    });

    return project;
  },

  async deleteProject(id: string) {
    const user = await requireRoles(["admin", "super-admin"]);
    const supabase = await createClient();

    const existing = await PortfolioRepository.findById(supabase, id);
    if (!existing) {
      throw new AppError("Portfolio project not found", "NOT_FOUND", 404);
    }

    await PortfolioRepository.delete(supabase, id);

    // Audit log
    const { ip, userAgent } = await getClientIpAndUserAgent();
    await AuditRepository.createSystemLog({
      user_id: user.id,
      action: "cms.portfolio.delete",
      entity_type: "portfolio_project",
      entity_id: id,
      details: { title: existing.title, slug: existing.slug },
      ip_address: ip,
      user_agent: userAgent,
    });

    return true;
  },

  async listPublishedProjectsOnly() {
    const supabase = createPublicClient();
    const projects = await PortfolioRepository.listPublished(supabase);
    return projects || [];
  },

  async getPublishedProjectBySlug(slug: string) {
    const supabase = createPublicClient();
    const project = await PortfolioRepository.findBySlug(supabase, slug);
    if (!project) {
      throw new AppError("Portfolio project not found", "NOT_FOUND", 404);
    }
    return project;
  }
};
