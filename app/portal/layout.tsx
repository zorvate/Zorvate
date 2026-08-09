import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutDashboard, FolderKanban, FolderClosed, FileText, MessageSquare, Settings, LogOut, Calendar } from "lucide-react";

import { createClient } from "@/lib/supabase/server";

const navItems = [
  { title: "Overview", href: "/portal", icon: LayoutDashboard },
  { title: "Projects", href: "/portal/projects", icon: FolderKanban },
  { title: "File Vault", href: "/portal/files", icon: FolderClosed },
  { title: "Invoices", href: "/portal/invoices", icon: FileText },
  { title: "Messages", href: "/portal/messages", icon: MessageSquare },
  { title: "Book Meeting", href: "/portal/meetings", icon: Calendar },
  { title: "Settings", href: "/portal/settings", icon: Settings },
];

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      {/* SIDEBAR — Linear Inspired */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-surface select-none">
        <div className="flex h-16 items-center justify-between px-6 border-b border-border">
          <Link href="/portal" className="flex items-center gap-2">
            <div className="size-6 rounded-[var(--radius-sm)] bg-foreground text-background flex items-center justify-center font-mono font-bold text-xs">
              Z
            </div>
            <span className="font-mono font-semibold text-xs tracking-wider uppercase text-foreground">
              WORKSPACE
            </span>
          </Link>
          <span className="mono-label text-[9px] text-emerald-400">ONLINE</span>
        </div>

        <div className="px-4 py-3">
          <span className="mono-label text-[9px] text-muted-foreground">CLIENT PORTAL</span>
        </div>

        <nav className="flex-grow px-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-[var(--radius-sm)] text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-surface-secondary transition-colors"
            >
              <item.icon className="size-4 text-primary/80" />
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>

        {/* User profile widget */}
        <div className="p-4 border-t border-border space-y-3">
          <div className="p-3 bg-surface-secondary border border-border rounded-[var(--radius-sm)] space-y-1">
            <div className="mono-label text-[9px] text-primary">
              {profile?.role || "CLIENT PARTNER"}
            </div>
            <div className="text-xs font-mono font-medium text-foreground truncate select-all">
              {profile?.full_name || user.email}
            </div>
          </div>
          
          <Link
            href="/auth/login"
            className="flex items-center gap-2 px-3 py-2 text-xs font-mono text-destructive hover:bg-destructive/10 rounded-[var(--radius-sm)] transition-colors"
          >
            <LogOut className="size-3.5" />
            <span>Logout Session</span>
          </Link>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-grow flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden flex h-16 items-center justify-between px-6 border-b border-border bg-surface z-10">
          <Link href="/portal" className="font-mono font-semibold text-xs tracking-wider uppercase">
            ZORVATE WORKSPACE
          </Link>
          <span className="mono-label text-[9px] text-primary">
            {profile?.role || "Client"}
          </span>
        </header>

        {/* Workspace body */}
        <main className="flex-1 p-6 sm:p-8 md:p-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
