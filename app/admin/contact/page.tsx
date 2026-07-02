"use client";

import { useEffect, useState, useCallback } from "react";
import { listContactRequestsAction, updateContactRequestAction } from "@/lib/backend/actions/contact-actions";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Filter, ShieldAlert } from "lucide-react";

interface ContactRequest {
  id: string;
  name: string;
  email: string;
  company?: string | null;
  project_type?: string | null;
  budget?: string | null;
  message: string;
  status: string;
  priority: string;
  created_at: string;
}

const statusList = ["new", "contacted", "qualified", "archived"];
const priorityList = ["low", "medium", "high", "critical"];

export default function AdminContactInbox() {
  const [inquiries, setInquiries] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    const res = await listContactRequestsAction();
    if (res.success) {
      setInquiries((res.data as ContactRequest[]) || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const handleStatusChange = async (inquiryId: string, newStatus: string) => {
    const res = await updateContactRequestAction(inquiryId, { status: newStatus as "new" | "contacted" | "qualified" | "archived" });
    if (!res.success) {
      alert(`Error updating lead status: ${res.error}`);
    } else {
      await fetchInquiries();
    }
  };

  const handlePriorityChange = async (inquiryId: string, newPriority: string) => {
    const res = await updateContactRequestAction(inquiryId, { priority: newPriority as "low" | "medium" | "high" | "critical" });
    if (!res.success) {
      alert(`Error updating lead priority: ${res.error}`);
    } else {
      await fetchInquiries();
    }
  };

  // Filtered list computed
  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch =
      inq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inq.company && inq.company.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === "all" || inq.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || inq.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-rose-500/10 text-rose-500 border border-rose-500/20";
      case "high":
        return "bg-amber-500/10 text-amber-500 border border-amber-500/20";
      case "medium":
        return "bg-blue-500/10 text-blue-500 border border-blue-500/20";
      default:
        return "bg-zinc-500/10 text-zinc-400 border border-zinc-500/25";
    }
  };

  return (
    <div className="space-y-8 select-none text-foreground">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Contact CRM Inbox</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Review quote inquiries, qualify leads, filter budgets, and coordinate consultation calls.
        </p>
      </div>

      {/* SEARCH AND FILTERS BAR */}
      <div className="grid md:grid-cols-3 gap-4 bg-card/20 p-4 border border-border/40 rounded-2xl">
        <div className="space-y-1.5 col-span-1">
          <Label className="text-[11px] font-bold text-muted-foreground flex items-center gap-1.5">
            <Search size={12} /> Search Leads
          </Label>
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, company, email..."
            className="text-xs h-9 bg-background/50"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-[11px] font-bold text-muted-foreground flex items-center gap-1.5">
            <Filter size={12} /> Filter Status
          </Label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full border border-input rounded-md h-9 px-2 bg-transparent text-xs text-foreground font-semibold"
          >
            <option value="all">All Statuses</option>
            {statusList.map((s) => (
              <option key={s} value={s} className="capitalize">
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-[11px] font-bold text-muted-foreground flex items-center gap-1.5">
            <ShieldAlert size={12} /> Filter Priority
          </Label>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full border border-input rounded-md h-9 px-2 bg-transparent text-xs text-foreground font-semibold"
          >
            <option value="all">All Priorities</option>
            {priorityList.map((p) => (
              <option key={p} value={p} className="capitalize">
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* INBOX CONTENT */}
      <Card className="border bg-card">
        <CardHeader>
          <CardTitle className="text-base">Inquiries Catalogue</CardTitle>
          <CardDescription className="text-xs">
            Review incoming sales leads, adjust priority ratings, and log callback results.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 text-xs">
          {loading ? (
            <div className="text-center py-12 text-sm text-muted-foreground font-mono">Synchronizing Inquiries database...</div>
          ) : filteredInquiries.length > 0 ? (
            <div className="divide-y border-t border-border/40">
              {filteredInquiries.map((inq) => (
                <div key={inq.id} className="p-5 flex flex-col sm:flex-row justify-between sm:items-start gap-4 hover:bg-card/10 transition-colors">
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="font-bold text-sm text-foreground">{inq.name}</span>
                      <span className="text-xs text-muted-foreground">({inq.email})</span>
                      {inq.company && <span className="text-xs bg-muted px-2 py-0.5 rounded border border-border/20 font-bold">{inq.company}</span>}
                      <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold ${getPriorityBadgeClass(inq.priority)}`}>
                        {inq.priority}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-primary">
                      Type: {inq.project_type || "N/A"} &bull; Budget: {inq.budget || "N/A"}
                    </div>
                    <p className="text-xs text-muted-foreground max-w-xl bg-card/40 p-3 rounded-lg leading-relaxed mt-2 font-semibold">
                      {inq.message}
                    </p>
                  </div>

                  <div className="flex flex-row sm:flex-col gap-2 items-start sm:items-end flex-shrink-0">
                    <div className="space-y-1">
                      <span className="text-[10px] text-muted-foreground block font-bold">Status</span>
                      <select
                        className="border border-border/80 rounded px-2 py-1 text-xs bg-transparent capitalize font-semibold h-8"
                        value={inq.status}
                        onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                      >
                        {statusList.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-muted-foreground block font-bold">Priority</span>
                      <select
                        className="border border-border/80 rounded px-2 py-1 text-xs bg-transparent capitalize font-semibold h-8"
                        value={inq.priority}
                        onChange={(e) => handlePriorityChange(inq.id, e.target.value)}
                      >
                        {priorityList.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-sm text-muted-foreground italic font-semibold border-t border-border/40">
              No inquiries found matching criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
