"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Briefcase,
  Mail,
  FolderClosed,
  Coins,
  Settings,
  ArrowUpRight,
} from "lucide-react";

const adminNav = [
  { title: "Overview", href: "/admin", icon: LayoutDashboard },
  { title: "Users & Roles", href: "/admin/users", icon: Users },
  { title: "Manage Projects", href: "/admin/projects", icon: FolderKanban },
  { title: "Portfolio CMS", href: "/admin/portfolio", icon: FolderClosed },
  { title: "Pricing System", href: "/admin/pricing", icon: Coins },
  { title: "Careers & Jobs", href: "/admin/careers", icon: Briefcase },
  { title: "Contact Inbox", href: "/admin/contact", icon: Mail },
  { title: "Site Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-border bg-surface select-none flex-shrink-0">
      <div className="flex h-16 items-center justify-between px-6 border-b border-border">
        <Link href="/admin" prefetch={true} className="flex items-center gap-2">
          <div className="size-6 rounded-[var(--radius-sm)] bg-primary text-primary-foreground flex items-center justify-center font-mono font-bold text-xs">
            A
          </div>
          <span className="font-mono font-semibold text-xs tracking-wider uppercase text-foreground">
            ADMIN DESK
          </span>
        </Link>
        <span className="mono-label text-[9px] text-emerald-400">ROOT</span>
      </div>

      <div className="px-4 py-3">
        <span className="mono-label text-[9px] px-2 text-muted-foreground">SYSTEM CONTROLS</span>
      </div>

      <nav className="flex-grow px-3 space-y-1 overflow-y-auto">
        {adminNav.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              className={`flex items-center gap-3 px-3 py-2 rounded-[var(--radius-sm)] text-xs font-mono transition-all duration-150 active:scale-[0.98] ${
                isActive
                  ? "bg-primary/10 text-primary font-bold border border-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface-secondary"
              }`}
            >
              <item.icon className={`size-4 ${isActive ? "text-primary" : "text-primary/70"}`} />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Admin controls */}
      <div className="p-4 border-t border-border space-y-3">
        <div className="p-3 bg-surface-secondary border border-border rounded-[var(--radius-sm)] space-y-1">
          <div className="mono-label text-[9px] text-primary">ADMIN SESSION</div>
          <div className="text-xs font-mono font-medium text-foreground truncate">
            {userEmail}
          </div>
        </div>

        <Link
          href="/portal"
          prefetch={true}
          className="flex items-center justify-between text-xs font-mono text-muted-foreground hover:text-foreground p-2 rounded-[var(--radius-sm)] hover:bg-surface-secondary transition-colors"
        >
          <span>Client Portal</span>
          <ArrowUpRight className="size-3.5" />
        </Link>
      </div>
    </aside>
  );
}
