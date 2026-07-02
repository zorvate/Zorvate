import Link from "next/link";
import { LayoutDashboard, Users, FolderKanban, Briefcase, Mail, FolderClosed, Coins, Settings } from "lucide-react";

import { requireAdmin } from "@/lib/auth/require-admin";

const adminNav = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Users & Roles", href: "/admin/users", icon: Users },
  { title: "Manage Projects", href: "/admin/projects", icon: FolderKanban },
  { title: "Portfolio CMS", href: "/admin/portfolio", icon: FolderClosed },
  { title: "Pricing System", href: "/admin/pricing", icon: Coins },
  { title: "Careers & Jobs", href: "/admin/careers", icon: Briefcase },
  { title: "Contact Inbox", href: "/admin/contact", icon: Mail },
  { title: "Site Settings", href: "/admin/settings", icon: Settings },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireAdmin();

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* ADMIN SIDEBAR */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-background">
        <div className="flex h-16 items-center px-6 border-b bg-primary text-primary-foreground">
          <Link href="/admin" className="font-extrabold text-lg tracking-tight">
            Zorvate Admin
          </Link>
        </div>

        <nav className="flex-grow p-4 space-y-1">
          {adminNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <item.icon size={18} />
              {item.title}
            </Link>
          ))}
        </nav>

        {/* Footer controls */}
        <div className="p-4 border-t space-y-2">
          <div className="px-4 py-2 bg-muted/40 rounded-lg">
            <div className="text-[10px] font-bold text-muted-foreground uppercase">
              Administrator
            </div>
            <div className="text-xs font-semibold text-foreground truncate mt-0.5">
              {user.email}
            </div>
          </div>
          <Link
            href="/portal"
            className="block text-center text-xs font-semibold text-primary hover:underline py-1"
          >
            Switch to Client Portal
          </Link>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-grow flex flex-col min-w-0">
        <header className="md:hidden flex h-16 items-center justify-between px-6 border-b bg-background z-10">
          <Link href="/admin" className="font-extrabold text-lg">
            Zorvate Admin
          </Link>
          <span className="text-[10px] bg-primary text-primary-foreground font-bold px-2.5 py-1 rounded">
            Admin Mode
          </span>
        </header>

        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}