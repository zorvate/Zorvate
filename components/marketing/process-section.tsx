"use client";

import { motion } from "framer-motion";
import { Compass, Palette, Code, Rocket } from "lucide-react";
import { SectionWrapper } from "./section-wrapper";

const steps = [
  { icon: Compass, title: "Discovery & Blueprint", desc: "System scope analysis, architectural schema definition, milestone planning, and technical stack selection.", tag: "PHASE 01" },
  { icon: Palette, title: "Interface Architecture", desc: "High-density design systems, typography hierarchy, component specification, and interactive prototype validation.", tag: "PHASE 02" },
  { icon: Code, title: "System Implementation", desc: "Strict TypeScript development, Next.js 15 routing, database schema triggers, and end-to-end integration.", tag: "PHASE 03" },
  { icon: Rocket, title: "Deployment & Delivery", desc: "Production edge deployment, Lighthouse performance auditing, client workspace handover, and SLA monitoring.", tag: "PHASE 04" },
];

export function ProcessSection() {
  return (
    <SectionWrapper className="border-b border-border bg-background/70">
      <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
        <div className="space-y-4 lg:sticky lg:top-24">
          <span className="mono-label text-[10px] text-primary">03 / Delivery Pipeline</span>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">A vertical process, not a timeline.</h2>
          <p className="text-sm leading-7 text-muted-foreground">Each stage is a controlled layer of delivery: strategy, interface architecture, engineering implementation, and live operations.</p>
        </div>

        <div className="space-y-4">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div key={idx} initial={{ opacity: 0, x: 18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: idx * 0.06 }} className="panel-shell flex flex-col gap-4 p-5 md:flex-row md:items-start md:justify-between">
                <div className="flex gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-surface-secondary text-primary">
                    <Icon className="size-4" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-[10px] font-mono uppercase tracking-[0.24em] text-primary">{step.tag}</div>
                    <h3 className="text-base font-semibold tracking-tight text-foreground">{step.title}</h3>
                    <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{step.desc}</p>
                  </div>
                </div>
                <div className="text-[10px] font-mono uppercase tracking-[0.24em] text-muted-foreground md:pl-6">Stage {idx + 1}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}
