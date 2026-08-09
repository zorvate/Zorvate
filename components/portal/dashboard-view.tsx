"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FolderKanban, FileText, Bell, Inbox, Copy, Check, Send, UploadCloud, ArrowUpRight } from "lucide-react";
import CountUp from "react-countup";
import { Badge } from "@/components/ui/badge";

interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
  progress: number;
}

interface Invoice {
  id: string;
  amount: string;
  status: string;
}

interface Notification {
  id: string;
  title: string;
  content: string;
  created_at: string;
  read: boolean;
}

interface Props {
  projects: Project[];
  invoices: Invoice[];
  notifications: Notification[];
}

export function PortalDashboardView({ projects, invoices, notifications }: Props) {
  const [copied, setCopied] = useState(false);

  const activeProjectsCount = projects.filter((p) => p.status === "active").length;
  const unpaidInvoices = invoices.filter((i) => i.status === "unpaid");
  const unpaidTotal = unpaidInvoices.reduce((sum, inv) => sum + Number(inv.amount), 0);
  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  const copyReferral = () => {
    navigator.clipboard.writeText("ZORVATE-CLIENT-REF");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 text-foreground font-sans">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 rounded-[var(--radius-card)] border border-border bg-surface grid-pattern"
      >
        <div className="space-y-2">
          <span className="mono-label text-[10px] text-primary">CLIENT WORKSPACE v1.0</span>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
            System Workspace
          </h1>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-xl font-normal">
            Track active engineering sprints, inspect milestone completion progress, review open invoices, and communicate with lead engineers.
          </p>
        </div>
      </motion.div>

      {/* QUICK ACTIONS ROW */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-surface border border-border rounded-[var(--radius-card)] p-5 flex flex-col justify-between space-y-4">
          <div>
            <span className="mono-label text-[9px]">REFERRAL CODE</span>
            <p className="text-xs font-mono font-semibold text-primary mt-1 select-all">
              ZORVATE-CLIENT-REF
            </p>
          </div>
          <button
            onClick={copyReferral}
            className="flex items-center justify-center gap-1.5 rounded-[var(--radius-sm)] border border-border bg-surface-secondary hover:bg-surface-tertiary px-3 py-1.5 text-xs font-mono transition-colors"
          >
            {copied ? (
              <>
                <Check className="size-3 text-emerald-400" /> Copied!
              </>
            ) : (
              <>
                <Copy className="size-3" /> Copy Code
              </>
            )}
          </button>
        </div>

        <div className="bg-surface border border-border rounded-[var(--radius-card)] p-5 flex flex-col justify-between space-y-4">
          <div>
            <span className="mono-label text-[9px]">ENGINEERING DISPATCH</span>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Open direct dialogue channel with studio leads.
            </p>
          </div>
          <Link
            href="/portal/messages"
            className="flex items-center justify-center gap-1.5 rounded-[var(--radius-sm)] bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1.5 text-xs font-mono transition-colors"
          >
            <Send className="size-3" /> Open Dispatch
          </Link>
        </div>

        <div className="bg-surface border border-border rounded-[var(--radius-card)] p-5 flex flex-col justify-between space-y-4">
          <div>
            <span className="mono-label text-[9px]">FILE CONTAINER</span>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Upload credentials, scope PDFs, or assets safely.
            </p>
          </div>
          <Link
            href="/portal/files"
            className="flex items-center justify-center gap-1.5 rounded-[var(--radius-sm)] border border-border bg-surface-secondary hover:bg-surface-tertiary px-3 py-1.5 text-xs font-mono transition-colors"
          >
            <UploadCloud className="size-3" /> Upload Asset
          </Link>
        </div>
      </div>

      {/* METRICS PANELS */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          {
            title: "Active Sprints",
            value: activeProjectsCount,
            suffix: "",
            desc: "Projects currently in active phase",
            icon: FolderKanban,
          },
          {
            title: "Pending Invoices",
            value: unpaidTotal,
            prefix: "$",
            suffix: "",
            desc: `${unpaidInvoices.length} unpaid invoices pending`,
            icon: FileText,
          },
          {
            title: "Alerts Desk",
            value: unreadNotifsCount,
            suffix: "",
            desc: "Unread workspace notifications",
            icon: Bell,
          },
        ].map((metric, mIdx) => {
          const Icon = metric.icon;
          return (
            <div
              key={mIdx}
              className="bg-surface border border-border rounded-[var(--radius-card)] p-6 space-y-3"
            >
              <div className="flex justify-between items-start">
                <span className="mono-label text-[10px] text-muted-foreground">{metric.title}</span>
                <div className="size-7 rounded-[var(--radius-sm)] bg-surface-tertiary border border-border flex items-center justify-center text-primary">
                  <Icon className="size-3.5" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-semibold tracking-tight text-foreground font-mono flex items-baseline gap-0.5">
                  <span>{metric.prefix}</span>
                  <CountUp
                    end={metric.value}
                    decimals={metric.prefix ? 2 : 0}
                    duration={1.5}
                    enableScrollSpy
                    scrollSpyOnce
                  />
                </div>
                <p className="text-[11px] font-mono text-muted-foreground">{metric.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* WORKSPACE SECTIONS GRID */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Active Projects List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <h2 className="text-base font-semibold tracking-tight text-foreground">
            Active Projects &amp; Sprints
          </h2>
          {projects.length > 0 ? (
            <div className="grid gap-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-surface border border-border rounded-[var(--radius-card)] p-6 space-y-6 hover:border-border-hover transition-colors"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <h3 className="text-base font-semibold text-foreground">{project.name}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {project.description || "No project overview description provided."}
                      </p>
                    </div>
                    <Badge variant="default">{project.status}</Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-muted-foreground">Sprint Completion</span>
                      <span className="text-primary font-semibold">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-surface-secondary h-1.5 rounded-full overflow-hidden border border-border/40">
                      <motion.div
                        className="bg-primary h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/50 flex justify-end">
                    <Link
                      href={`/portal/projects/${project.id}`}
                      className="text-xs font-mono uppercase tracking-wider text-primary hover:text-foreground transition-colors flex items-center gap-1"
                    >
                      Workspace Details <ArrowUpRight className="size-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 border border-border rounded-[var(--radius-card)] bg-surface text-center flex flex-col items-center justify-center space-y-3">
              <FolderKanban className="size-8 text-muted-foreground/40" />
              <div className="space-y-1">
                <div className="text-xs font-semibold text-foreground">No Active Sprints</div>
                <p className="text-xs text-muted-foreground max-w-xs font-normal">
                  When a project scope contract is initiated, active sprint details will display here.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Notifications Activity (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <h2 className="text-base font-semibold tracking-tight text-foreground">
            Activity Feed
          </h2>
          {notifications.length > 0 ? (
            <div className="border border-border rounded-[var(--radius-card)] bg-surface divide-y divide-border overflow-hidden">
              {notifications.map((notif) => (
                <div key={notif.id} className="p-4 space-y-1 hover:bg-surface-secondary transition-colors">
                  <div className="flex justify-between items-start gap-2">
                    <div className="text-xs font-semibold text-foreground">{notif.title}</div>
                    {!notif.read && (
                      <span className="size-1.5 rounded-full bg-primary flex-shrink-0 mt-1" />
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-normal">{notif.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-10 border border-border rounded-[var(--radius-card)] bg-surface text-center flex flex-col items-center justify-center space-y-2">
              <Inbox className="size-6 text-muted-foreground/40" />
              <div className="text-xs font-mono text-muted-foreground">All Activities Validated</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
