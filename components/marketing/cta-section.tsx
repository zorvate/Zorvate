"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SectionWrapper } from "./section-wrapper";

export function CTASection() {
  return (
    <SectionWrapper className="border-t bg-background relative overflow-hidden py-24">
      {/* Decorative Outer Aurora */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-5xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-3xl bg-gradient-to-br from-card via-card/85 to-primary/5 border border-primary/25 px-8 py-20 text-center relative overflow-hidden shadow-xl"
        >
          {/* Subtle mesh background grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000002_1px,transparent_1px),linear-gradient(to_bottom,#00000002_1px,transparent_1px)] bg-[size:16px_28px] opacity-40 pointer-events-none" />

          {/* Core Spotlight Glow Inside Card */}
          <div className="absolute -bottom-1/2 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-primary/10 to-accent/5 blur-[90px] pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3.5 py-1 rounded-full border border-primary/10 mb-6 select-none">
              Let&apos;s Build
            </span>
            
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-foreground">
              Ready to Engineer Your Digital Vision?
            </h2>

            <p className="mt-6 text-sm sm:text-base text-muted-foreground leading-relaxed">
              Partner with us to build premium websites, SaaS dashboards, and database systems. Tell us about your project scale and milestones.
            </p>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-10"
            >
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-primary-foreground text-sm font-bold shadow-lg hover:shadow-xl shadow-primary/20 transition-all duration-300 group glow-btn"
              >
                Let&apos;s Talk <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
