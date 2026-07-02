import { SupabaseClient } from "@supabase/supabase-js";

export const SettingsRepository = {
  async getByKey(supabase: SupabaseClient, key: string) {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("key", key)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async listAll(supabase: SupabaseClient) {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*");
    if (error) throw error;
    return data || [];
  },

  async upsert(supabase: SupabaseClient, key: string, value: string, label: string) {
    const { data, error } = await supabase
      .from("site_settings")
      .upsert({ key, value, label, updated_at: new Date().toISOString() })
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};
