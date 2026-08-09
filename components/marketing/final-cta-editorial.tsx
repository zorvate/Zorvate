"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { MagneticButton } from "@/components/ui/magnetic-button";

export function FinalCTAEditorial() {
  return (
    <section className="bg-[#F5F4F0] border-b border-[#E0DDD6] selection:bg-[#FF4D00]/20 overflow-hidden relative">
      {/* Subtle grid pattern */}
      <div className="grid-line-pattern absolute inset-0 pointer-events-none opacity-40" />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 py-20 md:py-28 lg:py-32">

        {/* Chapter label */}
        <div className="text-xs font-mono uppercase tracking-[0.18em] text-[#5C5D61] mb-6 flex items-center gap-2">
          <span className="signal-dot" />
          INITIATE / ENGAGEMENT
        </div>

        <div className="max-w-4xl space-y-6 md:space-y-8">
          {/* Primary Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl lg:text-7xl font-bold uppercase tracking-tight text-[#121316] leading-[0.94]"
          >
            YOUR BUSINESS
            <br />
            HAS A SYSTEM
            <br />
            <span className="text-[#5C5D61]">WAITING TO</span>
            <br />
            <span className="relative inline-block">
              BE BUILT.
              <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="absolute bottom-1 left-0 w-full h-[4px] bg-[#FF4D00] origin-left block"
              />
            </span>
          </motion.h2>

          {/* Supporting statement */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg text-[#5C5D61] leading-relaxed max-w-xl font-normal"
          >
            Tell us what you&apos;re trying to build. We&apos;ll show you how to connect it, automate it, and engineer it for long-term clarity.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center gap-4 pt-2"
          >
            <MagneticButton>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 text-sm font-mono uppercase tracking-[0.14em] font-semibold bg-[#121316] text-[#F5F4F0] hover:bg-[#FF4D00] transition-colors duration-200 group"
              >
                Start a Project
                <ArrowUpRight className="size-4 text-[#FF4D00] group-hover:text-[#F5F4F0] transition-colors" />
              </Link>
            </MagneticButton>

            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-mono uppercase tracking-[0.14em] font-medium border border-[#E0DDD6] text-[#5C5D61] hover:border-[#121316] hover:text-[#121316] transition-colors duration-200"
            >
              View All Work
            </Link>
          </motion.div>
        </div>

        {/* Bottom metadata strip */}
        <div className="mt-16 md:mt-20 pt-8 border-t border-[#E0DDD6] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-xs font-mono uppercase tracking-[0.14em] text-[#5C5D61]">
            ZORVATE DIGITAL ENGINEERING STUDIO — PAKISTAN / WORLDWIDE
          </div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.14em] text-[#5C5D61]">
            <span className="signal-dot" />
            <span>ACCEPTING NEW PROJECTS</span>
          </div>
        </div>
      </div>
    </section>
  );
}
