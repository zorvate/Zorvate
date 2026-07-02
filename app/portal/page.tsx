import { createClient } from "@/lib/supabase/server";
import { PortalDashboardView } from "@/components/portal/dashboard-view";

export default async function PortalDashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Query projects
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("client_id", user?.id || "");

  // Query invoices
  const { data: invoices } = await supabase
    .from("invoices")
    .select("*")
    .eq("client_id", user?.id || "");

  // Query notifications
  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user?.id || "")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <PortalDashboardView
      projects={projects || []}
      invoices={invoices || []}
      notifications={notifications || []}
    />
  );
}
