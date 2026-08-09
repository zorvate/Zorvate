"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FolderKanban, FileText, Briefcase, Mail, ArrowUpRight, UserPlus, FileSignature, Settings } from "lucide-react";

interface ContactRequest {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

interface Props {
  totalProjects: number;
  activeProjects: number;
  totalInvoiced: number;
  totalApplications: number;
  contacts: ContactRequest[];
}

export function AdminDashboardView({
  totalProjects,
  activeProjects,
  totalInvoiced,
  totalApplications,
  contacts,
}: Props) {
  return (
    <div className="space-y-8 text-foreground font-sans">
      {/* Header Overview Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 rounded-[var(--radius-card)] border border-border bg-surface grid-pattern"
      >
        <div className="space-y-2">
          <span className="mono-label text-[10px] text-primary">ADMIN CONSOLE v1.0</span>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
            System Operations Desk
          </h1>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-xl font-normal">
            Monitor active client contracts, track cumulative invoice volume, review career applications, and audit inbound leads.
          </p>
        </div>
      </motion.div>

      {/* QUICK ACTIONS ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Add Client Profile", href: "/admin/users", icon: UserPlus },
          { label: "New Contract", href: "/admin/projects", icon: FileSignature },
          { label: "Applicant Desk", href: "/admin/careers", icon: Briefcase },
          { label: "Admin Settings", href: "/admin/settings", icon: Settings },
        ].map((act, aIdx) => {
          const Icon = act.icon;
          return (
            <Link
              key={aIdx}
              href={act.href}
              className="p-4 rounded-[var(--radius-card)] border border-border bg-surface hover:bg-surface-secondary hover:border-border-hover transition-colors flex flex-col items-center justify-center text-center gap-2.5 text-xs font-mono text-foreground select-none"
            >
              <div className="size-8 rounded-[var(--radius-sm)] bg-surface-tertiary border border-border flex items-center justify-center text-primary">
                <Icon className="size-4" />
              </div>
              <span>{act.label}</span>
            </Link>
          );
        })}
      </div>

      {/* METRICS PANELS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Total Contracts",
            value: totalProjects,
            desc: `${activeProjects} currently active`,
            icon: FolderKanban,
          },
          {
            title: "Cumulative Volume",
            value: `$${totalInvoiced.toFixed(2)}`,
            desc: "Invoiced billing balance",
            icon: FileText,
          },
          {
            title: "Inbound Leads",
            value: contacts.length,
            desc: "Lead inbox inquiries",
            icon: Mail,
          },
          {
            title: "Resumes Catalog",
            value: totalApplications,
            desc: "Careers desk logs",
            icon: Briefcase,
          },
        ].map((metric, mIdx) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={mIdx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: mIdx * 0.05 }}
              className="p-6 rounded-[var(--radius-card)] border border-border bg-surface space-y-3"
            >
              <div className="flex justify-between items-start">
                <span className="mono-label text-[10px] text-muted-foreground">{metric.title}</span>
                <div className="size-7 rounded-[var(--radius-sm)] bg-surface-tertiary border border-border flex items-center justify-center text-primary">
                  <Icon className="size-3.5" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-semibold tracking-tight text-foreground font-mono">
                  {metric.value}
                </div>
                <p className="text-[11px] font-mono text-muted-foreground">{metric.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* RECENT INQUIRIES DATA TABLE */}
      <div className="space-y-4">
        <div className="flex justify-between items-center select-none">
          <h2 className="text-base font-semibold tracking-tight text-foreground">
            Recent Inquiries Inbox
          </h2>
          <Link
            href="/admin/contact"
            className="text-xs font-mono text-primary hover:text-foreground transition-colors flex items-center gap-1"
          >
            Manage All Inbox <ArrowUpRight className="size-3.5" />
          </Link>
        </div>

        {contacts.length > 0 ? (
          <div className="border border-border rounded-[var(--radius-card)] bg-surface overflow-hidden divide-y divide-border">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="p-4 sm:p-5 flex justify-between items-center gap-4 hover:bg-surface-secondary transition-colors"
              >
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-foreground">{contact.name}</div>
                  <div className="text-xs font-mono text-muted-foreground">{contact.email}</div>
                </div>
                <span
                  suppressHydrationWarning
                  className="text-[10px] font-mono text-muted-foreground select-none"
                >
                  {new Date(contact.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 border border-border rounded-[var(--radius-card)] bg-surface text-center text-xs font-mono text-muted-foreground">
            No inquiries logged in system.
          </div>
        )}
      </div>
    </div>
  );
}
