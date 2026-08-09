import { createClient } from "@/lib/supabase/server";
import { AdminDashboardView } from "@/components/admin/dashboard-view";

interface ContactRequest {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Parallelize independent database queries
  const [projectsRes, invoicesRes, jobsRes, contactsRes] = await Promise.all([
    supabase.from("projects").select("id, status"),
    supabase.from("invoices").select("amount"),
    supabase.from("job_applications").select("id"),
    supabase
      .from("contact_requests")
      .select("id, name, email, created_at")
      .order("created_at", { ascending: false })
      .limit(3),
  ]);

  const projects = projectsRes.data;
  const invoices = invoicesRes.data;
  const jobs = jobsRes.data;
  const contacts = contactsRes.data;

  const totalProjects = projects?.length || 0;
  const activeProjects = projects?.filter((p) => p.status === "active").length || 0;
  const totalInvoiced = invoices?.reduce((sum, inv) => sum + Number(inv.amount), 0) || 0;
  const totalApplications = jobs?.length || 0;

  return (
    <AdminDashboardView
      totalProjects={totalProjects}
      activeProjects={activeProjects}
      totalInvoiced={totalInvoiced}
      totalApplications={totalApplications}
      contacts={(contacts as unknown as ContactRequest[]) || []}
    />
  );
}
