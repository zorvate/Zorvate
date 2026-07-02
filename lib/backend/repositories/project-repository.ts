import { SupabaseClient } from "@supabase/supabase-js";

export interface ProjectInput {
  client_id: string;
  name: string;
  description?: string;
  status?: "planning" | "active" | "completed" | "on_hold";
  progress?: number;
  start_date?: string | null;
  end_date?: string | null;
}

export const ProjectRepository = {
  async findById(supabase: SupabaseClient, id: string) {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async listByClientId(supabase: SupabaseClient, clientId: string) {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async listAll(supabase: SupabaseClient) {
    const { data, error } = await supabase
      .from("projects")
      .select("*, profiles!projects_client_id_fkey(full_name, email)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async create(supabase: SupabaseClient, data: ProjectInput) {
    const { data: project, error } = await supabase
      .from("projects")
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return project;
  },

  async update(supabase: SupabaseClient, id: string, data: Partial<ProjectInput>) {
    const { data: project, error } = await supabase
      .from("projects")
      .update(data)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return project;
  },

  async delete(supabase: SupabaseClient, id: string) {
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return true;
  }
};
