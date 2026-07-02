import { createClient, createPublicClient } from "@/lib/supabase/server";
import { ServiceRepository } from "../repositories/service-repository";
import { requireRoles, getClientIpAndUserAgent } from "../utils/auth";
import { serviceSchema, ServiceInputType } from "@/lib/validations/cms";
import { AuditRepository } from "../repositories/audit-repository";
import { AppError } from "../utils/errors";

export const ServiceService = {
  async getService(id: string) {
    const supabase = await createClient();
    const service = await ServiceRepository.findById(supabase, id);
    if (!service) {
      throw new AppError("Service not found", "NOT_FOUND", 404);
    }
    return service;
  },

  async listServices() {
    const supabase = await createClient();
    return ServiceRepository.listAll(supabase);
  },

  async createService(input: ServiceInputType) {
    const user = await requireRoles(["admin", "super-admin"]);
    const supabase = await createClient();

    // Input validation
    const parsed = serviceSchema.parse(input);

    // Verify slug uniqueness
    const existing = await ServiceRepository.findBySlug(supabase, parsed.slug);
    if (existing) {
      throw new AppError("A service with this slug already exists", "DUPLICATE_SLUG", 409);
    }

    const service = await ServiceRepository.create(supabase, parsed);

    // Audit log
    const { ip, userAgent } = await getClientIpAndUserAgent();
    await AuditRepository.createSystemLog({
      user_id: user.id,
      action: "cms.service.create",
      entity_type: "service",
      entity_id: service.id,
      details: { title: service.title, slug: service.slug },
      ip_address: ip,
      user_agent: userAgent,
    });

    return service;
  },

  async updateService(id: string, input: Partial<ServiceInputType>) {
    const user = await requireRoles(["admin", "super-admin"]);
    const supabase = await createClient();

    // Verify exists
    const existing = await ServiceRepository.findById(supabase, id);
    if (!existing) {
      throw new AppError("Service not found", "NOT_FOUND", 404);
    }

    // Input validation
    const parsed = serviceSchema.partial().parse(input);

    // Verify slug uniqueness if slug changed
    if (parsed.slug && parsed.slug !== existing.slug) {
      const duplicate = await ServiceRepository.findBySlug(supabase, parsed.slug);
      if (duplicate) {
        throw new AppError("A service with this slug already exists", "DUPLICATE_SLUG", 409);
      }
    }

    const service = await ServiceRepository.update(supabase, id, parsed);

    // Audit log
    const { ip, userAgent } = await getClientIpAndUserAgent();
    await AuditRepository.createSystemLog({
      user_id: user.id,
      action: "cms.service.update",
      entity_type: "service",
      entity_id: service.id,
      details: { title: service.title, changed_fields: Object.keys(parsed) },
      ip_address: ip,
      user_agent: userAgent,
    });

    return service;
  },

  async deleteService(id: string) {
    const user = await requireRoles(["admin", "super-admin"]);
    const supabase = await createClient();

    const existing = await ServiceRepository.findById(supabase, id);
    if (!existing) {
      throw new AppError("Service not found", "NOT_FOUND", 404);
    }

    await ServiceRepository.delete(supabase, id);

    // Audit log
    const { ip, userAgent } = await getClientIpAndUserAgent();
    await AuditRepository.createSystemLog({
      user_id: user.id,
      action: "cms.service.delete",
      entity_type: "service",
      entity_id: id,
      details: { title: existing.title, slug: existing.slug },
      ip_address: ip,
      user_agent: userAgent,
    });

    return true;
  },

  async listServicesPublic() {
    try {
      const supabase = createPublicClient();
      return await ServiceRepository.listAll(supabase);
    } catch (e) {
      console.warn("Database query for services list failed. Falling back.", e);
      return [];
    }
  },

  async getServiceBySlugPublic(slug: string) {
    try {
      const supabase = createPublicClient();
      const service = await ServiceRepository.findBySlug(supabase, slug);
      if (service) return service;
    } catch (e) {
      console.warn(`Database query for service slug "${slug}" failed.`, e);
    }
    return null;
  }
};
