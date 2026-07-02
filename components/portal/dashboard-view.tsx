"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FolderKanban, FileText, Bell, Inbox, Copy, Check, Send, UploadCloud } from "lucide-react";
import CountUp from "react-countup";

import { GlassCard } from "@/components/ui/glass-card";

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
    <div className="space-y-8 relative z-10 text-foreground">
      {/* Welcome Banner OS-style */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 rounded-3xl border bg-gradient-to-br from-primary/5 via-accent/5 to-card/45 backdrop-blur-xl relative overflow-hidden glass-panel shadow-sm"
      >
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary/10 blur-[80px] pointer-events-none" />
        <div className="relative z-10">
          <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20 mb-4 inline-block shadow-sm">
            Client Hub v1.0
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mt-2 leading-none">
            Your Digital Space
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base mt-3 max-w-xl font-medium leading-relaxed">
            Welcome back to Zorvate. Monitor active sprints, review milestone completions, and manage invoices instantly.
          </p>
        </div>
      </motion.div>

      {/* QUICK ACTIONS ROW */}
      <div className="grid sm:grid-cols-3 gap-4">
        <GlassCard
          tilt={true}
          tiltMaxAngle={3}
          glowColor="primary"
          className="p-5 border bg-card/25 flex flex-col justify-between"
        >
          <div>
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Client ID Referral</h3>
            <p className="text-sm font-extrabold mt-2 select-all font-mono text-primary">ZORVATE-CLIENT-REF</p>
          </div>
          <button
            onClick={copyReferral}
            className="mt-4 flex items-center justify-center gap-1.5 rounded-xl border bg-background hover:bg-muted py-2 text-xs font-bold transition-all w-full cursor-pointer h-10 border-border/80"
          >
            {copied ? (
              <>
                <Check size={13} className="text-emerald-500" /> Copied!
              </>
            ) : (
              <>
                <Copy size={13} /> Copy Code
              </>
            )}
          </button>
        </GlassCard>

        <GlassCard
          tilt={true}
          tiltMaxAngle={3}
          glowColor="accent"
          className="p-5 border bg-card/25 flex flex-col justify-between"
        >
          <div>
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Support Sprint</h3>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed font-medium">
              Open a quick messaging dialogue directly with the engineering leads.
            </p>
          </div>
          <Link
            href="/portal/messages"
            className="mt-4 flex items-center justify-center gap-1.5 rounded-xl bg-primary text-primary-foreground py-2 text-xs font-bold transition-all hover:scale-[1.02] shadow-sm h-10 w-full"
          >
            <Send size={13} /> Chat Support
          </Link>
        </GlassCard>

        <GlassCard
          tilt={true}
          tiltMaxAngle={3}
          glowColor="primary"
          className="p-5 border bg-card/25 flex flex-col justify-between"
        >
          <div>
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">File Vault</h3>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed font-medium">
              Upload credentials, scope PDFs, or assets safely to the project container.
            </p>
          </div>
          <Link
            href="/portal/files"
            className="mt-4 flex items-center justify-center gap-1.5 rounded-xl border bg-background hover:bg-muted py-2 text-xs font-bold transition-all h-10 w-full flex border-border/80"
          >
            <UploadCloud size={13} /> Upload Asset
          </Link>
        </GlassCard>
      </div>

      {/* METRICS PANELS */}
      <div className="grid sm:grid-cols-3 gap-6">
        {[
          { title: "Active Contracts", value: activeProjectsCount, suffix: "", desc: "Sprints in design/dev phases", icon: FolderKanban },
          { title: "Pending Balance", value: unpaidTotal, prefix: "$", suffix: "", desc: `${unpaidInvoices.length} unpaid invoices`, icon: FileText },
          { title: "Alerts Desk", value: unreadNotifsCount, suffix: "", desc: "Unread dashboard messages", icon: Bell },
        ].map((metric, mIdx) => {
          const Icon = metric.icon;
          return (
            <GlassCard
              key={mIdx}
              tilt={false}
              className="p-6 border bg-card/20 flex flex-col justify-between hover:border-primary/20 transition-all duration-300"
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">
                  {metric.title}
                </span>
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <Icon size={16} />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-black tracking-tight text-foreground flex items-baseline">
                  {metric.prefix}
                  <CountUp
                    end={metric.value}
                    decimals={metric.prefix ? 2 : 0}
                    duration={2.0}
                    enableScrollSpy
                    scrollSpyOnce
                  />
                  {metric.suffix}
                </div>
                <p className="text-xs text-muted-foreground mt-1.5 font-medium">
                  {metric.desc}
                </p>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* WORKSPACE SECTIONS GRID */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Active Projects List */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-bold tracking-tight text-foreground">Your Projects</h2>
          {projects.length > 0 ? (
            <div className="grid gap-4">
              {projects.map((project) => (
                <GlassCard
                  key={project.id}
                  tilt={false}
                  className="p-6 border bg-card/20 flex flex-col justify-between hover:border-primary/20 transition-all duration-300"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-base text-foreground">{project.name}</h3>
                      <p className="text-xs text-muted-foreground mt-2.5 max-w-md font-medium leading-relaxed">
                        {project.description || "No project overview description provided."}
                      </p>
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-primary/20 text-primary bg-primary/5 select-none">
                      {project.status}
                    </span>
                  </div>

                  <div className="mt-6 space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-muted-foreground">Sprints Completion</span>
                      <span className="text-primary font-bold">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                      <motion.div
                        className="bg-primary h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress}%` }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                      />
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-border/40 flex justify-end">
                    <Link
                      href={`/portal/projects/${project.id}`}
                      className="text-xs font-bold text-primary hover:text-foreground transition-colors flex items-center gap-1"
                    >
                      View Workspace &rarr;
                    </Link>
                  </div>
                </GlassCard>
              ))}
            </div>
          ) : (
            <GlassCard
              tilt={false}
              className="p-12 border bg-card/20 text-center flex flex-col items-center justify-center space-y-4"
            >
              <FolderKanban size={36} className="text-muted-foreground/35 animate-pulse" />
              <div>
                <div className="font-bold text-foreground">No Active Projects</div>
                <p className="text-xs text-muted-foreground max-w-xs mt-1 font-medium leading-relaxed">
                  When you initiate a project contract with us, it will appear here for progress sprint updates.
                </p>
              </div>
            </GlassCard>
          )}
        </div>

        {/* Notifications Timeline */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight text-foreground">Recent Activities</h2>
          {notifications.length > 0 ? (
            <div className="border border-border/80 rounded-2xl bg-card/25 backdrop-blur-md divide-y divide-border/40 overflow-hidden">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className="p-4 space-y-1.5 hover:bg-white/5 transition-colors"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="text-xs font-bold text-foreground leading-normal">{notif.title}</div>
                    {!notif.read && (
                      <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-1" />
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-normal font-medium">{notif.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <GlassCard
              tilt={false}
              className="p-12 border bg-card/20 text-center flex flex-col items-center justify-center space-y-3"
            >
              <Inbox size={28} className="text-muted-foreground/35" />
              <div className="text-xs font-bold text-muted-foreground">All Sprints Validated</div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}
