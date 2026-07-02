"use client";

import { motion } from "framer-motion";
import { ShieldCheck, HeartHandshake, Zap, Cpu } from "lucide-react";
import { SectionWrapper } from "./section-wrapper";

const items = [
  {
    icon: ShieldCheck,
    title: "Strict Type Safety",
    desc: "We write 100% typed code using TypeScript. No exceptions, no shortcuts, ensuring stable runtime behavior.",
  },
  {
    icon: Zap,
    title: "High Performance",
    desc: "Lightning-fast static page loads, dynamic caching, and responsive code-splitting optimized out-of-the-box.",
  },
  {
    icon: Cpu,
    title: "Modern Ecosystem",
    desc: "Integrating Next.js 15, Supabase auth, storage, and database triggers for instant app workflows.",
  },
  {
    icon: HeartHandshake,
    title: "Client-Centric Portal",
    desc: "Real-time chat, detailed milestones tracking, file vault, and invoicing built directly into your dashboard.",
  },
];

export function WhyChooseUsSection() {
  return (
    <SectionWrapper className="border-t bg-muted/20 relative overflow-hidden py-24 md:py-32">
      {/* Decorative Blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-5xl relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3.5 py-1 rounded-full border border-primary/10 select-none"
          >
            Platform Benefits
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight text-foreground"
          >
            Why Startups Partner With Us
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-muted-foreground text-base leading-relaxed"
          >
            We don&apos;t just build templates; we deliver enterprise-grade codebase systems built for long-term scalability.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="flex gap-5 p-6 rounded-2xl border bg-card/50 hover:bg-card/75 hover:border-primary/20 transition-all duration-300 glass-panel group"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <Icon size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}
