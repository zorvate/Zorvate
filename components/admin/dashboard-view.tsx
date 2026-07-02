"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FolderKanban, FileText, Briefcase, Mail, ArrowRight, UserPlus, FileSignature, Settings } from "lucide-react";

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
    <div className="space-y-8 relative z-10">
      {/* Welcome Banner OS-style */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 rounded-3xl border bg-gradient-to-br from-primary/5 via-violet-500/5 to-card/45 backdrop-blur-xl relative overflow-hidden glass-panel shadow-sm"
      >
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary/10 blur-[80px] pointer-events-none" />
        <div className="relative z-10">
          <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/10 mb-4 inline-block select-none">
            Admin Console v1.0
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mt-2">
            Overview Desk
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base mt-2 max-w-xl font-medium leading-relaxed">
            Monitor client billing statements, track active contract status pipelines, and review inbound lead inquiries.
          </p>
        </div>
      </motion.div>

      {/* QUICK ACTIONS ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Add Client Profile", href: "/admin/users", icon: UserPlus },
          { label: "New Contract", href: "/admin/projects", icon: FileSignature },
          { label: "Applicant Desk", href: "/admin/careers", icon: Briefcase },
          { label: "Admin Settings", href: "/admin", icon: Settings },
        ].map((act, aIdx) => {
          const Icon = act.icon;
          return (
            <Link
              key={aIdx}
              href={act.href}
              className="p-4 rounded-xl border bg-card/45 hover:bg-card/85 backdrop-blur-md glass-panel flex flex-col items-center justify-center text-center gap-2 text-xs font-bold text-foreground hover:border-primary/20 transition-all select-none"
            >
              <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                <Icon size={16} />
              </div>
              <span>{act.label}</span>
            </Link>
          );
        })}
      </div>

      {/* METRICS PANELS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Total Contracts", value: totalProjects, desc: `${activeProjects} currently active`, icon: FolderKanban },
          { title: "Cumulative Volume", value: `$${totalInvoiced.toFixed(2)}`, desc: "Invoiced billing balance", icon: FileText },
          { title: "Inbound Leads", value: contacts.length, desc: "Lead inbox inquiries", icon: Mail },
          { title: "Resumes Catalog", value: totalApplications, desc: "Careers desk logs", icon: Briefcase },
        ].map((metric, mIdx) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={mIdx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: mIdx * 0.08 }}
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl border bg-card/40 hover:bg-card/75 backdrop-blur-md glass-panel relative overflow-hidden group transition-all"
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  {metric.title}
                </span>
                <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <Icon size={15} />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-black tracking-tight text-foreground">
                  {metric.value}
                </div>
                <p className="text-[11px] text-muted-foreground mt-1.5 font-medium">
                  {metric.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* INCOMING LEADS DIAL */}
      <div className="space-y-4">
        <div className="flex justify-between items-center select-none">
          <h2 className="text-xl font-bold tracking-tight text-foreground">Recent Inquiries Inbox</h2>
          <Link
            href="/admin/contact"
            className="text-xs font-bold text-primary hover:text-foreground transition-colors flex items-center gap-1"
          >
            Manage All Inbox <ArrowRight size={12} />
          </Link>
        </div>

        {contacts.length > 0 ? (
          <div className="border rounded-2xl bg-card/30 backdrop-blur-md glass-panel divide-y divide-border/40 overflow-hidden">
            {contacts.map((contact, cIdx) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: cIdx * 0.05 }}
                className="p-4 sm:p-5 flex justify-between items-center gap-4 hover:bg-muted/10 transition-colors"
              >
                <div>
                  <div className="text-sm font-bold text-foreground">{contact.name}</div>
                  <div className="text-xs text-muted-foreground mt-1 font-medium">{contact.email}</div>
                </div>
                <span suppressHydrationWarning className="text-[10px] font-semibold text-muted-foreground select-none">
                  {new Date(contact.created_at).toLocaleDateString()}
                </span>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-10 border rounded-2xl bg-card/30 backdrop-blur text-center text-xs text-muted-foreground glass-panel select-none">
            No inquiries received yet.
          </div>
        )}
      </div>
    </div>
  );
}
