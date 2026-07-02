import { SupabaseClient } from "@supabase/supabase-js";
import { ServiceInputType } from "@/lib/validations/cms";

export const ServiceRepository = {
  async findById(supabase: SupabaseClient, id: string) {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async findBySlug(supabase: SupabaseClient, slug: string) {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async listAll(supabase: SupabaseClient) {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("display_order", { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async create(supabase: SupabaseClient, data: ServiceInputType) {
    const { data: service, error } = await supabase
      .from("services")
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return service;
  },

  async update(supabase: SupabaseClient, id: string, data: Partial<ServiceInputType>) {
    const { data: service, error } = await supabase
      .from("services")
      .update(data)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return service;
  },

  async delete(supabase: SupabaseClient, id: string) {
    const { error } = await supabase
      .from("services")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return true;
  }
};
