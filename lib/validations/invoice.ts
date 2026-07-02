import { z } from "zod";

export const invoiceSchema = z.object({
  project_id: z.string().uuid("Invalid project ID").optional().nullable(),
  client_id: z.string().uuid("Invalid client ID"),
  invoice_number: z.string().min(3, "Invoice number must be at least 3 characters").max(50),
  amount: z.number().positive("Amount must be greater than zero"),
  status: z.enum(["unpaid", "paid", "overdue", "cancelled"]).default("unpaid"),
  issue_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid issue date format (YYYY-MM-DD)"),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid due date format (YYYY-MM-DD)"),
  pdf_path: z.string().optional().nullable(),
});

export type InvoiceInputType = z.infer<typeof invoiceSchema>;
