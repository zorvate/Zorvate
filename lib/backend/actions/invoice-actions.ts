"use server";

import { InvoiceService } from "../services/invoice-service";
import { InvoiceInput } from "../repositories/invoice-repository";
import { handleAction } from "../utils/errors";
import { revalidatePath } from "next/cache";

export async function createInvoiceAction(input: InvoiceInput) {
  return handleAction(async () => {
    const invoice = await InvoiceService.createInvoice(input);
    revalidatePath("/portal/invoices");
    revalidatePath("/admin/pricing");
    return invoice;
  });
}

export async function updateInvoiceAction(id: string, input: Partial<InvoiceInput>) {
  return handleAction(async () => {
    const invoice = await InvoiceService.updateInvoice(id, input);
    revalidatePath("/portal/invoices");
    revalidatePath("/admin/pricing");
    return invoice;
  });
}

export async function deleteInvoiceAction(id: string) {
  return handleAction(async () => {
    await InvoiceService.deleteInvoice(id);
    revalidatePath("/portal/invoices");
    revalidatePath("/admin/pricing");
    return true;
  });
}
