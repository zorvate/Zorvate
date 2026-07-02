"use server";

import { revalidatePath } from "next/cache";
import { handleAction } from "../utils/errors";
import { requireRoles } from "../utils/auth";
import { createClient } from "@/lib/supabase/server";

// Services
import { ServiceService } from "../services/service-service";
import { PortfolioService } from "../services/portfolio-service";
import { TeamService } from "../services/team-service";
import { SettingsService } from "../services/settings-service";

// Schema validations
import {
  faqSchema,
  testimonialSchema,
  FaqInputType,
  TestimonialInputType,
  TeamMemberInputType,
  ServiceInputType,
  PortfolioProjectInputType
} from "@/lib/validations/cms";

// Database operations from lib/supabase/cms
import { saveFaq, deleteFaq, saveTestimonial, deleteTestimonial, getRawSiteSettings, getFaqs, getTestimonials } from "@/lib/supabase/cms";

// FAQ Actions
export async function saveFaqAction(input: FaqInputType) {
  return handleAction(async () => {
    await requireRoles(["admin", "super-admin"]);
    const supabase = await createClient();
    
    const parsed = faqSchema.parse(input);
    const result = await saveFaq(supabase, parsed);
    revalidatePath("/pricing");
    revalidatePath("/faq");
    revalidatePath("/admin/settings");
    return result;
  });
}

export async function deleteFaqAction(id: string) {
  return handleAction(async () => {
    await requireRoles(["admin", "super-admin"]);
    const supabase = await createClient();
    
    await deleteFaq(supabase, id);
    revalidatePath("/pricing");
    revalidatePath("/faq");
    revalidatePath("/admin/settings");
    return true;
  });
}

// Testimonial Actions
export async function saveTestimonialAction(input: TestimonialInputType) {
  return handleAction(async () => {
    await requireRoles(["admin", "super-admin"]);
    const supabase = await createClient();
    
    const parsed = testimonialSchema.parse(input);
    const result = await saveTestimonial(supabase, parsed);
    revalidatePath("/");
    revalidatePath("/admin/settings");
    return result;
  });
}

export async function deleteTestimonialAction(id: string) {
  return handleAction(async () => {
    await requireRoles(["admin", "super-admin"]);
    const supabase = await createClient();
    
    await deleteTestimonial(supabase, id);
    revalidatePath("/");
    revalidatePath("/admin/settings");
    return true;
  });
}

// Team Member Actions
export async function saveTeamMemberAction(input: TeamMemberInputType) {
  return handleAction(async () => {
    const result = await TeamService.createTeamMember(input);
    revalidatePath("/about");
    revalidatePath("/admin/settings");
    return result;
  });
}

export async function updateTeamMemberAction(id: string, input: Partial<TeamMemberInputType>) {
  return handleAction(async () => {
    const result = await TeamService.updateTeamMember(id, input);
    revalidatePath("/about");
    revalidatePath("/admin/settings");
    return result;
  });
}

export async function deleteTeamMemberAction(id: string) {
  return handleAction(async () => {
    await TeamService.deleteTeamMember(id);
    revalidatePath("/about");
    revalidatePath("/admin/settings");
    return true;
  });
}

// Service Actions
export async function saveServiceAction(input: ServiceInputType) {
  return handleAction(async () => {
    const result = await ServiceService.createService(input);
    revalidatePath("/services");
    revalidatePath(`/services/${result.slug}`);
    revalidatePath("/admin/settings");
    return result;
  });
}

export async function updateServiceAction(id: string, input: Partial<ServiceInputType>) {
  return handleAction(async () => {
    const result = await ServiceService.updateService(id, input);
    revalidatePath("/services");
    revalidatePath(`/services/${result.slug}`);
    revalidatePath("/admin/settings");
    return result;
  });
}

export async function deleteServiceAction(id: string) {
  return handleAction(async () => {
    await ServiceService.deleteService(id);
    revalidatePath("/services");
    revalidatePath("/admin/settings");
    return true;
  });
}

// Portfolio Actions
export async function savePortfolioProjectAction(input: PortfolioProjectInputType) {
  return handleAction(async () => {
    const result = await PortfolioService.createProject(input);
    revalidatePath("/portfolio");
    revalidatePath(`/portfolio/${result.slug}`);
    revalidatePath("/admin/portfolio");
    return result;
  });
}

export async function updatePortfolioProjectAction(id: string, input: Partial<PortfolioProjectInputType>) {
  return handleAction(async () => {
    const result = await PortfolioService.updateProject(id, input);
    revalidatePath("/portfolio");
    revalidatePath(`/portfolio/${result.slug}`);
    revalidatePath("/admin/portfolio");
    return result;
  });
}

export async function deletePortfolioProjectAction(id: string) {
  return handleAction(async () => {
    await PortfolioService.deleteProject(id);
    revalidatePath("/portfolio");
    revalidatePath("/admin/portfolio");
    return true;
  });
}

// Settings Actions
export async function saveSiteSettingAction(key: string, value: string, label: string) {
  return handleAction(async () => {
    const result = await SettingsService.saveSetting(key, value, label);
    // Revalidate public landing and meta routing paths
    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/services");
    revalidatePath("/portfolio");
    revalidatePath("/pricing");
    revalidatePath("/contact");
    revalidatePath("/admin/settings");
    return result;
  });
}

export async function getRawSiteSettingsAction() {
  return handleAction(async () => {
    await requireRoles(["admin", "super-admin"]);
    const supabase = await createClient();
    return getRawSiteSettings(supabase);
  });
}

export async function getFaqsAction() {
  return handleAction(async () => {
    const supabase = await createClient();
    return getFaqs(supabase);
  });
}

export async function getTestimonialsAction() {
  return handleAction(async () => {
    const supabase = await createClient();
    return getTestimonials(supabase);
  });
}

export async function listPortfolioProjectsAction() {
  return handleAction(async () => {
    return PortfolioService.listProjects();
  });
}
