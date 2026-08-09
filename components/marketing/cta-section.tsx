"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SectionWrapper } from "./section-wrapper";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <SectionWrapper className="bg-surface/30 py-24 md:py-32">
      <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="panel-shell overflow-hidden">
        <div className="grid gap-8 border-b border-border bg-surface-secondary/60 px-6 py-8 md:grid-cols-[1fr_auto] md:items-center md:px-8">
          <div className="space-y-3">
            <span className="mono-label text-[10px] text-primary">07 / Initiate Partnership</span>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Enter a delivery partnership built for scale.</h2>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground">From product architecture to operational workflows, Zorvate builds systems that hold their structure under pressure.</p>
          </div>
          <Button asChild size="lg" variant="default" className="gap-2">
            <Link href="/contact">Initiate Project Scope <ArrowUpRight className="size-4" /></Link>
          </Button>
        </div>
        <div className="grid gap-3 bg-background/80 p-6 sm:grid-cols-3">
          <div className="rounded-[var(--radius-md)] border border-border bg-surface/60 p-4">
            <div className="text-[10px] font-mono uppercase tracking-[0.24em] text-primary">Scope</div>
            <div className="mt-2 text-sm font-semibold text-foreground">Architecture, systems, and product delivery</div>
          </div>
          <div className="rounded-[var(--radius-md)] border border-border bg-surface/60 p-4">
            <div className="text-[10px] font-mono uppercase tracking-[0.24em] text-primary">Delivery</div>
            <div className="mt-2 text-sm font-semibold text-foreground">Production-ready implementation</div>
          </div>
          <div className="rounded-[var(--radius-md)] border border-border bg-surface/60 p-4">
            <div className="text-[10px] font-mono uppercase tracking-[0.24em] text-primary">Support</div>
            <div className="mt-2 text-sm font-semibold text-foreground">Operational continuity after launch</div>
          </div>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
