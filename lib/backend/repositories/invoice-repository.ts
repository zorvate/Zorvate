import { SupabaseClient } from "@supabase/supabase-js";

export interface InvoiceInput {
  project_id?: string | null;
  client_id: string;
  invoice_number: string;
  amount: number;
  status?: "unpaid" | "paid" | "overdue" | "cancelled";
  issue_date: string;
  due_date: string;
  pdf_path?: string | null;
}

export const InvoiceRepository = {
  async findById(supabase: SupabaseClient, id: string) {
    const { data, error } = await supabase
      .from("invoices")
      .select("*, projects(name), profiles(full_name, email)")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async listByClientId(supabase: SupabaseClient, clientId: string) {
    const { data, error } = await supabase
      .from("invoices")
      .select("*, projects(name)")
      .eq("client_id", clientId)
      .order("issue_date", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async listAll(supabase: SupabaseClient) {
    const { data, error } = await supabase
      .from("invoices")
      .select("*, projects(name), profiles(full_name, email)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async create(supabase: SupabaseClient, data: InvoiceInput) {
    const { data: invoice, error } = await supabase
      .from("invoices")
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return invoice;
  },

  async update(supabase: SupabaseClient, id: string, data: Partial<InvoiceInput>) {
    const { data: invoice, error } = await supabase
      .from("invoices")
      .update(data)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return invoice;
  },

  async delete(supabase: SupabaseClient, id: string) {
    const { error } = await supabase
      .from("invoices")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return true;
  }
};
