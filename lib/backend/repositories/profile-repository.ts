import { SupabaseClient } from "@supabase/supabase-js";

export interface ProfileUpdateInput {
  full_name?: string;
  avatar_url?: string;
  role?: string;
}

export const ProfileRepository = {
  async findById(supabase: SupabaseClient, id: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async update(supabase: SupabaseClient, id: string, data: ProfileUpdateInput) {
    const { data: profile, error } = await supabase
      .from("profiles")
      .update(data)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return profile;
  },

  async listAll(supabase: SupabaseClient) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async delete(supabase: SupabaseClient, id: string) {
    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return true;
  }
};
