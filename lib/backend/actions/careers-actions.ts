"use server";

import { revalidatePath } from "next/cache";
import { handleAction } from "../utils/errors";
import { requireRoles, getClientIpAndUserAgent } from "../utils/auth";
import { createClient } from "@/lib/supabase/server";
import { AuditRepository } from "../repositories/audit-repository";

export async function listJobApplicationsAction() {
  return handleAction(async () => {
    await requireRoles(["admin", "super-admin"]);
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("job_applications")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  });
}

export async function updateJobApplicationStatusAction(id: string, status: string) {
  return handleAction(async () => {
    const user = await requireRoles(["admin", "super-admin"]);
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from("job_applications")
      .update({ status })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;

    // Audit log
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

    revalidatePath("/admin/careers");
    return data;
  });
}
