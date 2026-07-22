"use server";

import { createClient } from "@/lib/supabase/server";
import { CareersRepository } from "../repositories/careers-repository";
import { requireRoles, getClientIpAndUserAgent } from "../utils/auth";
import { AuditRepository } from "../repositories/audit-repository";
import {
  jobApplicationSchema,
  jobSchema,
  JobApplicationInputType,
  JobInputType,
} from "@/lib/validations/cms";
import type { Job, JobApplication } from "@/lib/supabase/cms";

export const CareersService = {
  async listOpenJobs(): Promise<Job[]> {
    const supabase = await createClient();
    return CareersRepository.listOpenJobs(supabase);
  },

  async listJobsForAdmin(): Promise<Job[]> {
    await requireRoles(["admin", "super-admin"]);
    const supabase = await createClient();
    return CareersRepository.listAllJobsAdmin(supabase);
  },

  async listJobApplications() {
    await requireRoles(["admin", "super-admin"]);
    const supabase = await createClient();
    return CareersRepository.listJobApplications(supabase);
  },

  async submitJobApplication(input: JobApplicationInputType): Promise<JobApplication> {
    const parsed = jobApplicationSchema.parse(input);
    const supabase = await createClient();
    const data = await CareersRepository.createJobApplication(supabase, parsed);

    try {
      const { ip, userAgent } = await getClientIpAndUserAgent();
      await AuditRepository.createSystemLog({
        user_id: null,
        action: "careers.application.submit",
        entity_type: "job_application",
        entity_id: data.id,
        details: { job_id: parsed.job_id, name: parsed.name, email: parsed.email },
        ip_address: ip,
        user_agent: userAgent,
      });
    } catch (error) {
      console.warn("Failed to audit job application submission:", error);
    }

    return data;
  },

  async saveJob(input: JobInputType) {
    const user = await requireRoles(["admin", "super-admin"]);
    const parsed = jobSchema.parse(input);
    const supabase = await createClient();
    const job = await CareersRepository.saveJob(supabase, parsed);

    try {
      const { ip, userAgent } = await getClientIpAndUserAgent();
      await AuditRepository.createSystemLog({
        user_id: user.id,
        action: `careers.job.${parsed.id ? "update" : "create"}`,
        entity_type: "job",
        entity_id: job.id,
        details: { title: job.title, status: job.status },
        ip_address: ip,
        user_agent: userAgent,
      });
    } catch (error) {
      console.warn("Failed to audit job save action:", error);
    }

    return job;
  },

  async deleteJob(id: string) {
    const user = await requireRoles(["admin", "super-admin"]);
    const supabase = await createClient();
    await CareersRepository.deleteJob(supabase, id);

    try {
      const { ip, userAgent } = await getClientIpAndUserAgent();
      await AuditRepository.createSystemLog({
        user_id: user.id,
        action: "careers.job.delete",
        entity_type: "job",
        entity_id: id,
        details: {},
        ip_address: ip,
        user_agent: userAgent,
      });
    } catch (error) {
      console.warn("Failed to audit job deletion:", error);
    }

    return true;
  },

  async updateJobApplicationStatus(id: string, status: string): Promise<JobApplication> {
    const user = await requireRoles(["admin", "super-admin"]);
    const supabase = await createClient();
    const data = await CareersRepository.updateJobApplicationStatus(supabase, id, status);

    const { ip, userAgent } = await getClientIpAndUserAgent();
    await AuditRepository.createSystemLog({
      user_id: user.id,
      action: "careers.application.update_status",
      entity_type: "job_application",
      entity_id: id,
      details: { name: data.name, status },
      ip_address: ip,
      user_agent: userAgent,
    });

    return data;
  },
};
