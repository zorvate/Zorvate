"use client";

import { motion } from "framer-motion";
import { ShieldCheck, HeartHandshake, Zap, Cpu } from "lucide-react";
import { SectionWrapper } from "./section-wrapper";

const items = [
  { icon: ShieldCheck, title: "Strict Type Safety", desc: "100% type-checked codebase using TypeScript. Zero untyped gaps, ensuring predictable runtime behavior and maintainability." },
  { icon: Zap, title: "High Performance", desc: "Edge-rendered page delivery, optimal static generation, and code-splitting tuned for Lighthouse score excellence." },
  { icon: Cpu, title: "Modern Architectural Stack", desc: "Built on Next.js 15, Supabase infrastructure, PostgreSQL triggers, and server-side state security." },
  { icon: HeartHandshake, title: "Client Engineering Portal", desc: "Linear-grade workspace for tracking active sprints, file vaults, direct milestone sign-offs, and transparent billing." },
];

export function WhyChooseUsSection() {
  return (
    <SectionWrapper className="border-b border-border bg-surface/30">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div className="space-y-4 lg:sticky lg:top-24">
          <span className="mono-label text-[10px] text-primary">02 / Engineering Principles</span>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Built for reliability, not novelty.</h2>
          <p className="text-sm leading-7 text-muted-foreground">The work is shaped by production discipline, exacting implementation standards, and an operating model that scales with the business.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div key={idx} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: idx * 0.05 }} className="panel-shell p-5">
                <div className="flex size-10 items-center justify-center rounded-full border border-border bg-surface-secondary text-primary"><Icon className="size-4" /></div>
                <h3 className="mt-4 text-base font-semibold tracking-tight text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}
