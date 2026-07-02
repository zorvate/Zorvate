"use server";

import { revalidatePath } from "next/cache";
import { handleAction } from "../utils/errors";
import { requireRoles, getClientIpAndUserAgent } from "../utils/auth";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { AuditRepository } from "../repositories/audit-repository";
import { contactRequestSchema, ContactRequestInputType } from "@/lib/validations/contact";
import { sendConfirmationEmail, sendAdminInquiryNotification } from "@/lib/email/send";

export async function listContactRequestsAction() {
  return handleAction(async () => {
    await requireRoles(["admin", "super-admin", "manager"]);
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("contact_requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  });
}

export async function submitContactInquiryAction(input: ContactRequestInputType) {
  return handleAction(async () => {
    // 1. Zod Validation
    const parsed = contactRequestSchema.parse(input);

    const supabase = await createClient();
    // 2. Insert inquiry (anonymous insertion allowed via anon policies)
    const { data: inquiry, error: insertError } = await supabase
      .from("contact_requests")
      .insert({
        name: parsed.name,
        email: parsed.email,
        company: parsed.company || null,
        project_type: parsed.project_type || null,
        budget: parsed.budget || null,
        message: parsed.message,
        file_path: parsed.file_path || null,
        status: parsed.status,
        priority: parsed.priority,
      })
      .select()
      .single();
    if (insertError) throw insertError;

    // 3. Notify Admins in Database
    // Fetch all admins using service role to bypass select restrictions
    const { data: admins } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .in("role", ["admin", "super-admin"]);

    if (admins && admins.length > 0) {
      const notificationsPayload = admins.map(admin => ({
        user_id: admin.id,
        title: "New CRM Inquiry",
        content: `${parsed.name} (${parsed.company || "No Company"}) requested a quote for ${parsed.project_type || "software"}.`,
        link: "/admin/contact",
      }));
      await supabaseAdmin.from("notifications").insert(notificationsPayload);
    }

    // 4. Send Confirmation Email to Client
    await sendConfirmationEmail(parsed.email, parsed.name);

    // 5. Send Admin Inquiry Notification Email (simulate alerting admin inbox)
    await sendAdminInquiryNotification("admin@zorvate.com", {
      name: parsed.name,
      email: parsed.email,
      company: parsed.company || undefined,
      message: parsed.message,
      budget: parsed.budget || undefined,
      project_type: parsed.project_type || undefined,
    });

    // 6. Record Audit Log (anonymous submitter -> user_id is null)
    const { ip, userAgent } = await getClientIpAndUserAgent();
    await AuditRepository.createSystemLog({
      user_id: null,
      action: "contact.inquiry.submit",
      entity_type: "contact_request",
      entity_id: inquiry.id,
      details: { name: parsed.name, email: parsed.email, company: parsed.company },
      ip_address: ip,
      user_agent: userAgent,
    });

    revalidatePath("/admin/contact");
    return inquiry;
  });
}

export async function updateContactRequestAction(id: string, input: Partial<ContactRequestInputType>) {
  return handleAction(async () => {
    const user = await requireRoles(["admin", "super-admin", "manager"]);
    const supabase = await createClient();
    
    // Partial parse validation
    const parsed = contactRequestSchema.partial().parse(input);

    const { data: inquiry, error } = await supabase
      .from("contact_requests")
      .update(parsed)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;

    // Audit log
    const { ip, userAgent } = await getClientIpAndUserAgent();
    await AuditRepository.createSystemLog({
      user_id: user.id,
      action: "contact.request.update",
      entity_type: "contact_request",
      entity_id: id,
      details: { name: inquiry.name, changed_fields: Object.keys(parsed) },
      ip_address: ip,
      user_agent: userAgent,
    });

    revalidatePath("/admin/contact");
    return inquiry;
  });
}
