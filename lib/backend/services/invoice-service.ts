import { createClient } from "@/lib/supabase/server";
import { InvoiceRepository, InvoiceInput } from "../repositories/invoice-repository";
import { requireRoles, requireUser, getClientIpAndUserAgent } from "../utils/auth";
import { invoiceSchema } from "@/lib/validations/invoice";
import { AuditRepository } from "../repositories/audit-repository";
import { AppError } from "../utils/errors";

export const InvoiceService = {
  async getInvoice(id: string) {
    const user = await requireUser();
    const supabase = await createClient();

    const invoice = await InvoiceRepository.findById(supabase, id);
    if (!invoice) {
      throw new AppError("Invoice not found", "NOT_FOUND", 404);
    }

    // Clients can only read their own invoices; staff can read all
    if (user.role === "client" && invoice.client_id !== user.id) {
      throw new AppError("Access denied", "UNAUTHORIZED", 403);
    }

    return invoice;
  },

  async listInvoices() {
    const user = await requireUser();
    const supabase = await createClient();

    if (user.role === "client") {
      return InvoiceRepository.listByClientId(supabase, user.id);
    }

    return InvoiceRepository.listAll(supabase);
  },

  async createInvoice(input: InvoiceInput) {
    const user = await requireRoles(["admin", "super-admin", "manager"]);
    const supabase = await createClient();

    // Input validation
    const parsed = invoiceSchema.parse(input);

    const invoice = await InvoiceRepository.create(supabase, parsed);

    // Audit logging
    const { ip, userAgent } = await getClientIpAndUserAgent();
    await AuditRepository.createSystemLog({
      user_id: user.id,
      action: "invoice.create",
      entity_type: "invoice",
      entity_id: invoice.id,
      details: { amount: invoice.amount, invoice_number: invoice.invoice_number, client_id: invoice.client_id },
      ip_address: ip,
      user_agent: userAgent,
    });

    return invoice;
  },

  async updateInvoice(id: string, input: Partial<InvoiceInput>) {
    const user = await requireRoles(["admin", "super-admin", "manager"]);
    const supabase = await createClient();

    // Verify exists
    const existing = await InvoiceRepository.findById(supabase, id);
    if (!existing) {
      throw new AppError("Invoice not found", "NOT_FOUND", 404);
    }

    // Input validation (partial parse)
    const parsed = invoiceSchema.partial().parse(input);

    const invoice = await InvoiceRepository.update(supabase, id, parsed);

    // Audit logging
    const { ip, userAgent } = await getClientIpAndUserAgent();
    await AuditRepository.createSystemLog({
      user_id: user.id,
      action: "invoice.update",
      entity_type: "invoice",
      entity_id: invoice.id,
      details: { changed_fields: Object.keys(parsed) },
      ip_address: ip,
      user_agent: userAgent,
    });

    return invoice;
  },

  async deleteInvoice(id: string) {
    const user = await requireRoles(["admin", "super-admin"]);
    const supabase = await createClient();

    // Verify exists
    const existing = await InvoiceRepository.findById(supabase, id);
    if (!existing) {
      throw new AppError("Invoice not found", "NOT_FOUND", 404);
    }

    await InvoiceRepository.delete(supabase, id);

    // Audit logging
    const { ip, userAgent } = await getClientIpAndUserAgent();
    await AuditRepository.createSystemLog({
      user_id: user.id,
      action: "invoice.delete",
      entity_type: "invoice",
      entity_id: id,
      details: { invoice_number: existing.invoice_number, client_id: existing.client_id },
      ip_address: ip,
      user_agent: userAgent,
    });

    return true;
  }
};
