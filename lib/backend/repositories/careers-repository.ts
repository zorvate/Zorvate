import { SupabaseClient } from "@supabase/supabase-js";
import type { Job, JobApplication } from "@/lib/supabase/cms";

type JobApplicationInsert = Omit<JobApplication, "id" | "created_at" | "status" | "jobs">;

export const CareersRepository = {
  async listOpenJobs(supabase: SupabaseClient): Promise<Job[]> {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("status", "open")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data as Job[]) || [];
  },

  async listAllJobsAdmin(supabase: SupabaseClient): Promise<Job[]> {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data as Job[]) || [];
  },

  async findJobById(supabase: SupabaseClient, id: string): Promise<Job | null> {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data as Job | null;
  },

  async saveJob(supabase: SupabaseClient, job: Partial<Job>): Promise<Job> {
    const { data, error } = await supabase
      .from("jobs")
      .upsert(job)
      .select()
      .single();
    if (error) throw error;
    return data as Job;
  },

  async deleteJob(supabase: SupabaseClient, id: string): Promise<boolean> {
    const { error } = await supabase
      .from("jobs")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return true;
  },

  async listJobApplications(supabase: SupabaseClient): Promise<JobApplication[]> {
    const { data, error } = await supabase
      .from("job_applications")
      .select("*, jobs(id, title)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data as JobApplication[]) || [];
  },

  async createJobApplication(supabase: SupabaseClient, application: JobApplicationInsert): Promise<JobApplication> {
    const { data, error } = await supabase
      .from("job_applications")
      .insert(application)
      .select()
      .single();
    if (error) throw error;
    return data as JobApplication;
  },

  async updateJobApplicationStatus(supabase: SupabaseClient, id: string, status: string): Promise<JobApplication> {
    const { data, error } = await supabase
      .from("job_applications")
      .update({ status })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data as JobApplication;
  },
};
