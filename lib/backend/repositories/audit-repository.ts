import { SupabaseClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabase/admin";

export interface AuditLogInput {
  user_id?: string | null;
  action: string;
  entity_type?: string;
  entity_id?: string;
  details?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
}

export const AuditRepository = {
  // Uses supabaseAdmin client to record the logs securely (bypass standard RLS policies for read-only write logs)
  async createSystemLog(data: AuditLogInput) {
    const { data: log, error } = await supabaseAdmin
      .from("audit_logs")
      .insert({
        user_id: data.user_id || null,
        action: data.action,
        entity_type: data.entity_type,
        entity_id: data.entity_id,
        details: data.details || {},
        ip_address: data.ip_address,
        user_agent: data.user_agent,
      })
      .select()
      .single();
    if (error) {
      console.error("[Audit Logging Failed]:", error);
    }
    return log;
  },

  async listAll(supabase: SupabaseClient) {
    const { data, error } = await supabase
      .from("audit_logs")
      .select("*, profiles(full_name, email)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  }
};
