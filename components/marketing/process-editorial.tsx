"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface Stage {
  number: string;
  name: string;
  subtitle: string;
  description: string;
}

const stages: Stage[] = [
  {
    number: "01",
    name: "DISCOVER",
    subtitle: "Domain & Bottleneck Analysis",
    description:
      "We map real business operations, data flows, and team interactions to isolate the true operational constraints and missed connections.",
  },
  {
    number: "02",
    name: "ARCHITECT",
    subtitle: "System Specification",
    description:
      "We design zero-trust security boundaries, database models, and API schemas before writing a single line of production code.",
  },
  {
    number: "03",
    name: "BUILD",
    subtitle: "Production Sprint Execution",
    description:
      "We construct the interface, backend, and data layer as a unified system — not a collection of bolted-together tools.",
  },
  {
    number: "04",
    name: "CONNECT",
    subtitle: "Integration & Automation Wiring",
    description:
      "We wire the system to your existing stack — CRMs, payment processors, comms platforms, external APIs, and data sources.",
  },
  {
    number: "05",
    name: "AUTOMATE",
    subtitle: "Workflow & Intelligence Layer",
    description:
      "We implement automation triggers, scheduled jobs, AI processes, and notification systems that remove manual overhead.",
  },
  {
    number: "06",
    name: "DEPLOY",
    subtitle: "Production Release & Handover",
    description:
      "We deploy to resilient edge infrastructure with monitoring, backups, and a clear operational handover to your team.",
  },
];

export function ProcessEditorial() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      id="process"
      ref={containerRef}
      className="py-20 md:py-28 lg:py-32 bg-[#F5F4F0] border-b border-[#E0DDD6] selection:bg-[#FF4D00]/20"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Chapter Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-10 md:pb-12 border-b border-[#E0DDD6] gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-[0.18em] text-[#5C5D61] mb-2">
              METHODOLOGY
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-[#121316] leading-[0.98]">
              ENGINEERING
              <br />
              PROCESS.
            </h2>
          </div>
          <div className="text-xs font-mono uppercase tracking-[0.14em] text-[#5C5D61]">
            06 STAGE DELIVERY SYSTEM
          </div>
        </div>

        {/* Process Stage Grid with Traveling Orange Line */}
        <div className="relative pt-10 md:pt-12 grid lg:grid-cols-12 gap-8">
          {/* Vertical Progress Line (Desktop only) */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-48 h-[calc(100vh-12rem)] flex flex-col">
              <div className="relative flex-1 w-[2px] bg-[#E0DDD6] mx-auto">
                <motion.div
                  style={{ height: lineHeight }}
                  className="w-full bg-[#FF4D00] origin-top"
                />
              </div>
            </div>
          </div>

          {/* Stage Cards Grid */}
          <div className="lg:col-span-11 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {stages.map((stage, idx) => (
              <motion.div
                key={stage.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.5,
                  delay: (idx % 3) * 0.07,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group p-7 border border-[#E0DDD6] bg-[#EFECE5]/30 hover:border-[#121316] hover:bg-[#EFECE5]/70 transition-all duration-200 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono tracking-[0.18em] text-[#FF4D00] font-semibold">
                    {stage.number}
                  </span>
                  <span className="signal-dot opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <h3 className="text-2xl font-bold uppercase tracking-tight text-[#121316]">
                  {stage.name}
                </h3>

                <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#5C5D61]">
                  {stage.subtitle}
                </div>

                <p className="text-sm text-[#5C5D61] leading-relaxed pt-1">
                  {stage.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
