import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutDashboard, FolderKanban, FolderClosed, FileText, MessageSquare, Settings, LogOut, Calendar } from "lucide-react";

import { createClient } from "@/lib/supabase/server";

const navItems = [
  { title: "Dashboard", href: "/portal", icon: LayoutDashboard },
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
    <div className="flex min-h-screen bg-background relative overflow-hidden select-none">
      {/* Decorative Orbs */}
      <div className="absolute top-12 left-1/4 w-80 h-80 rounded-full bg-primary/5 blur-[90px] pointer-events-none" />
      <div className="absolute bottom-16 right-1/4 w-96 h-96 rounded-full bg-accent/5 blur-[100px] pointer-events-none" />

      {/* SIDEBAR */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-card/45 backdrop-blur-md relative z-20">
        <div className="flex h-16 items-center px-6 border-b border-border/40 select-none">
          <Link href="/portal" className="font-black text-lg tracking-tighter text-foreground flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-black text-xs tracking-tighter">Z</span>
            <span>Zorvate Hub</span>
          </Link>
        </div>

        <nav className="flex-grow p-4 space-y-1.5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all"
            >
              <item.icon size={15} className="text-primary/70" />
              {item.title}
            </Link>
          ))}
        </nav>

        {/* User profile widget */}
        <div className="p-4 border-t border-border/40 space-y-3">
          <div className="px-4 py-3 rounded-2xl bg-muted/40 border">
            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              {profile?.role || "client"}
            </div>
            <div className="text-xs font-bold text-foreground truncate mt-0.5 select-all">
              {profile?.full_name || user.email}
            </div>
          </div>
          
          <Link
            href="/auth/login"
            className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-destructive hover:bg-destructive/10 rounded-xl transition-all"
          >
            <LogOut size={15} />
            Logout
          </Link>
        </div>
      </aside>

      {/* MAIN LAYOUT */}
      <div className="flex-grow flex flex-col min-w-0 relative z-10">
        {/* Mobile Header */}
        <header className="md:hidden flex h-16 items-center justify-between px-6 border-b bg-card/45 backdrop-blur-md z-20">
          <Link href="/portal" className="font-black text-base tracking-tighter flex items-center gap-1">
            <span className="w-5 h-5 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-black text-xs tracking-tighter">Z</span>
            <span>Zorvate</span>
          </Link>
          <div className="text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-primary/20 text-primary bg-primary/5 select-none">
            {profile?.role || "Client"}
          </div>
        </header>

        {/* Workspace details body wrapper */}
        <main className="flex-grow p-6 md:p-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
