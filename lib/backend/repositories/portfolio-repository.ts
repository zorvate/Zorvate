import { SupabaseClient } from "@supabase/supabase-js";
import { PortfolioProjectInputType } from "@/lib/validations/cms";

export const PortfolioRepository = {
  async findById(supabase: SupabaseClient, id: string) {
    const { data, error } = await supabase
      .from("portfolio_projects")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async findBySlug(supabase: SupabaseClient, slug: string) {
    const { data, error } = await supabase
      .from("portfolio_projects")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async listAllAdmin(supabase: SupabaseClient) {
    const { data, error } = await supabase
      .from("portfolio_projects")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async listPublished(supabase: SupabaseClient) {
    const { data, error } = await supabase
      .from("portfolio_projects")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async create(supabase: SupabaseClient, data: PortfolioProjectInputType) {
    const { data: project, error } = await supabase
      .from("portfolio_projects")
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return project;
  },

  async update(supabase: SupabaseClient, id: string, data: Partial<PortfolioProjectInputType>) {
    const { data: project, error } = await supabase
      .from("portfolio_projects")
      .update(data)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return project;
  },

  async delete(supabase: SupabaseClient, id: string) {
    const { error } = await supabase
      .from("portfolio_projects")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return true;
  }
};
