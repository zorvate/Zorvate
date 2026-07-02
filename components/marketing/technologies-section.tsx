"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "./section-wrapper";

const techs = [
  { name: "Next.js", category: "Core Framework", level: "Production Standard" },
  { name: "React 19", category: "UI Library", level: "Latest Standard" },
  { name: "TypeScript", category: "Languages", level: "Strict Static Typing" },
  { name: "Tailwind CSS v4", category: "Styling System", level: "Next-gen Engine" },
  { name: "Supabase", category: "Backend / Database", level: "DB, Storage, Auth" },
  { name: "Framer Motion", category: "Interactions", level: "Fluid Micro-animations" },
];

export function TechnologiesSection() {
  return (
    <SectionWrapper className="border-t bg-background relative overflow-hidden">
      <div className="mx-auto max-w-6xl relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full"
          >
            Modern Tech Stack
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight text-foreground"
          >
            Our Architecture Standards
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-muted-foreground text-base leading-relaxed"
          >
            We build exclusively with modern, scalable frameworks that deliver lightning-fast page loads and absolute typing security.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {techs.map((tech, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6 }}
              className="p-6 rounded-2xl border bg-background/50 hover:bg-card/60 hover:border-primary/10 transition-all duration-300 cursor-default glass-panel group"
            >
              <span className="text-[10px] font-black uppercase tracking-widest text-primary/70 mb-1 block">
                {tech.category}
              </span>
              <h3 className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                {tech.name}
              </h3>
              <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-muted-foreground/80">{tech.level}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
