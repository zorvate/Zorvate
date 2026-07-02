"use client";

import { motion } from "framer-motion";
import { Compass, Palette, Code, Rocket } from "lucide-react";
import { SectionWrapper } from "./section-wrapper";

const steps = [
  {
    icon: Compass,
    title: "Discovery & Strategy",
    desc: "We research your audience, map out the system architecture, and define clear project milestones.",
    tag: "Phase 01",
  },
  {
    icon: Palette,
    title: "Visual Design",
    desc: "We design a high-fidelity interactive prototype, crafting custom themes, typography, and fluid micro-interactions.",
    tag: "Phase 02",
  },
  {
    icon: Code,
    title: "Development",
    desc: "We build clean, robust frontend/backend systems using Next.js 15, strict TypeScript, and Supabase integration.",
    tag: "Phase 03",
  },
  {
    icon: Rocket,
    title: "Launch & Support",
    desc: "We configure server routing, run automated checkups, and publish your brand new application to production.",
    tag: "Phase 04",
  },
];

export function ProcessSection() {
  return (
    <SectionWrapper className="border-t bg-background relative overflow-hidden py-24 md:py-32">
      {/* Dynamic Background Spotlights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-6xl relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3.5 py-1 rounded-full border border-primary/10 select-none"
          >
            Our Delivery Pipeline
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight text-foreground"
          >
            How We Turn Ideas Into Code
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-muted-foreground text-base leading-relaxed"
          >
            A battle-tested process designed to deliver stable, high-performance web systems on time.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connecting Path line for desktop */}
          <div className="hidden lg:block absolute top-[68px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-primary/10 via-primary/45 to-primary/10 -z-10" />

          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 100, damping: 20, delay: idx * 0.15 }}
                whileHover={{ y: -6 }}
                className="group p-6 rounded-2xl border bg-card/40 hover:bg-card/75 hover:border-primary/20 hover:shadow-xl transition-all duration-300 relative flex flex-col justify-between glass-panel"
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-inner">
                      <Icon size={22} />
                    </div>
                    <span className="text-xs font-bold text-primary/70 bg-primary/5 px-2.5 py-0.5 rounded-full border border-primary/10">
                      {step.tag}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors mb-2">
                    {step.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed mt-2.5">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-border/40 flex justify-between items-center text-[10px] uppercase font-black tracking-widest text-muted-foreground select-none">
                  <span>Methodical</span>
                  <span>0{idx + 1}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}
