import Link from "next/link";
import { requireAdmin } from "@/lib/auth/require-admin";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireAdmin();

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      {/* ADMIN SIDEBAR */}
      <AdminSidebar userEmail={user.email || ""} />

      {/* MAIN CONTAINER */}
      <div className="flex-grow flex flex-col min-w-0">
        <header className="md:hidden flex h-16 items-center justify-between px-6 border-b border-border bg-surface z-10">
          <Link href="/admin" className="font-mono font-semibold text-xs tracking-wider uppercase">
            ADMIN DESK
          </Link>
          <span className="mono-label text-[9px] text-primary">ADMIN MODE</span>
        </header>

        <main className="flex-1 p-6 sm:p-8 md:p-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}