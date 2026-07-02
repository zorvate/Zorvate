import { FileText, Calendar, Wallet } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default async function PortalInvoices() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: invoices } = await supabase
    .from("invoices")
    .select("*")
    .eq("client_id", user?.id || "");

  const paidInvoices = invoices?.filter((i) => i.status === "paid") || [];
  const unpaidInvoices = invoices?.filter((i) => i.status === "unpaid") || [];

  const totalPaid = paidInvoices.reduce((sum, inv) => sum + Number(inv.amount), 0);
  const totalDue = unpaidInvoices.reduce((sum, inv) => sum + Number(inv.amount), 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Invoices</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Review payment histories, pending dues, and download invoice copies.
        </p>
      </div>

      {/* STATS */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        <Card className="border bg-background">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
              Total Outstanding
            </CardTitle>
            <Wallet size={16} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalDue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Outstanding fees for design or dev stages.
            </p>
          </CardContent>
        </Card>

        <Card className="border bg-background">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
              Total Paid
            </CardTitle>
            <FileText size={16} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPaid.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Completed transactions.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* LIST */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight">Invoice History</h2>
        {invoices && invoices.length > 0 ? (
          <div className="border rounded-xl bg-background divide-y">
            {invoices.map((inv) => (
              <div
                key={inv.id}
                className="p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <FileText size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground">
                      Invoice #{inv.invoice_number}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                      <Calendar size={12} />
                      Due {inv.due_date}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6">
                  <div className="text-right">
                    <div className="text-sm font-bold text-foreground">
                      ${Number(inv.amount).toFixed(2)}
                    </div>
                    <span className={`text-[10px] font-bold uppercase inline-block mt-1 px-2 py-0.5 rounded ${
                      inv.status === "paid" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : "bg-destructive/10 text-destructive"
                    }`}>
                      {inv.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 border rounded-xl bg-background text-center flex flex-col items-center justify-center space-y-3 max-w-lg mx-auto">
            <FileText size={40} className="text-muted-foreground/50" />
            <h2 className="font-bold text-lg">No Invoices Found</h2>
            <p className="text-sm text-muted-foreground">
              You do not have any invoice logs yet. When we generate bill payments, they will be listed here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
