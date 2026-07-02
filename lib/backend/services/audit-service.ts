import { createClient } from "@/lib/supabase/server";
import { AuditRepository } from "../repositories/audit-repository";
import { requireRoles } from "../utils/auth";

export const AuditService = {
  async listAuditLogs() {
    await requireRoles(["admin", "super-admin"]);
    const supabase = await createClient();
    return AuditRepository.listAll(supabase);
  }
};
