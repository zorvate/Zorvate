import { Compass, Eye, ShieldCheck, Zap, Handshake, ArrowUpRight } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { SectionWrapper } from "@/components/marketing/section-wrapper";
import { TeamService } from "@/lib/backend/services/team-service";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `About Studio | ${siteConfig.name}`,
  description:
    "Zorvate is a digital engineering studio dedicated to building high-performance web systems and applications.",
};

export default async function AboutPage() {
  const team = await TeamService.listTeamMembersPublic();

  return (
    <div className="bg-background relative min-h-screen text-foreground">
      <section className="border-b border-border pt-32 pb-24">
        <SectionWrapper className="py-0">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div className="max-w-3xl space-y-5">
              <span className="mono-label text-[10px] text-primary">01 / Studio Overview</span>
              <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                A studio built around systems, not pitches.
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                Zorvate operates as a digital engineering studio: architecture, product logic, delivery discipline, and client systems are designed as one continuous structure.
              </p>
            </div>
            <div className="panel-shell p-6">
              <div className="mb-4 text-[10px] font-mono uppercase tracking-[0.24em] text-primary">Studio spec</div>
              <div className="space-y-3 border-t border-border pt-4 text-sm text-muted-foreground">
                <div className="flex items-center justify-between border-b border-border/70 pb-3"><span>Operating model</span><span className="text-foreground">Product engineering</span></div>
                <div className="flex items-center justify-between border-b border-border/70 pb-3"><span>Delivery style</span><span className="text-foreground">System-first</span></div>
                <div className="flex items-center justify-between"><span>Primary value</span><span className="text-foreground">Longevity</span></div>
              </div>
            </div>
          </div>
        </SectionWrapper>
      </section>

      <SectionWrapper className="border-b border-border bg-surface/20">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="panel-shell p-8">
            <div className="mb-6 flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.24em] text-primary"><Compass className="size-3.5" /> Mission</div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Translate complexity into durable digital infrastructure.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">We build secure, modular, and maintainable systems that hold their structure beyond launch: portals, AI workflows, internal tools, automation layers, and product platforms.</p>
          </div>
          <div className="panel-shell p-8">
            <div className="mb-6 flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.24em] text-primary"><Eye className="size-3.5" /> Vision</div>
            <p className="text-sm leading-7 text-muted-foreground">The studio exists to replace fragmented delivery with an integrated model of design, engineering, and operational clarity. Each system is treated as a long-lived asset.</p>
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper className="border-b border-border bg-background/70">
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="space-y-4">
            <span className="mono-label text-[10px] text-primary">02 / Operating Principles</span>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">The standards that govern every engagement.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { title: "Uncompromising Precision", desc: "Strict type safety, semantic structure, and architectural review before implementation.", icon: ShieldCheck },
              { title: "High Performance", desc: "Lean delivery loops, optimized rendering, and production-grade engineering decisions.", icon: Zap },
              { title: "Client Synergy", desc: "Transparent workflows, controlled sprints, and direct alignment at every milestone.", icon: Handshake },
            ].map((val) => {
              const Icon = val.icon;
              return (
                <div key={val.title} className="panel-shell p-5">
                  <div className="flex size-9 items-center justify-center rounded-[var(--radius-sm)] border border-border bg-surface-secondary text-primary"><Icon className="size-4" /></div>
                  <h3 className="mt-4 text-base font-semibold tracking-tight text-foreground">{val.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{val.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper className="bg-surface/20">
        <div className="rounded-[var(--radius-card)] border border-border bg-background/80 p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="mono-label text-[10px] text-primary">03 / Engineering Team</span>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Lead architects and systems designers.</h2>
            </div>
            <Link href="/careers" className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.24em] text-primary transition-colors hover:text-foreground">
              Join the team <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {team.map((member) => (
              <div key={member.id} className="panel-shell p-5">
                <div className="relative h-40 overflow-hidden rounded-[var(--radius-sm)] border border-border bg-surface-secondary">
                  <Image src={member.image_url} alt={`${member.name} - ${member.role}`} fill className="object-cover" unoptimized />
                </div>
                <div className="mt-4 space-y-1">
                  <h3 className="text-base font-semibold tracking-tight text-foreground">{member.name}</h3>
                  <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-primary">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}