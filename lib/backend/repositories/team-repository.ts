import { SupabaseClient } from "@supabase/supabase-js";
import { TeamMemberInputType } from "@/lib/validations/cms";

export const TeamRepository = {
  async findById(supabase: SupabaseClient, id: string) {
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async listAll(supabase: SupabaseClient) {
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .order("display_order", { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async create(supabase: SupabaseClient, data: TeamMemberInputType) {
    const { data: member, error } = await supabase
      .from("team_members")
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return member;
  },

  async update(supabase: SupabaseClient, id: string, data: Partial<TeamMemberInputType>) {
    const { data: member, error } = await supabase
      .from("team_members")
      .update(data)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return member;
  },

  async delete(supabase: SupabaseClient, id: string) {
    const { error } = await supabase
      .from("team_members")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return true;
  }
};
