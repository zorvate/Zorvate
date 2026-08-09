"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface SystemItem {
  number: string;
  title: string;
  tags: string[];
  description: string;
  spec: string;
}

const systemsData: SystemItem[] = [
  {
    number: "01",
    title: "DIGITAL PRODUCTS",
    tags: ["Websites", "Landing systems", "E-commerce", "Digital experiences"],
    description:
      "High-assurance digital platforms and modern web applications engineered for speed, search prominence, and seamless conversions.",
    spec: "PERFORMANCE / SSR / EDGE DEPLOYMENT",
  },
  {
    number: "02",
    title: "BUSINESS SYSTEMS",
    tags: ["Dashboards", "Client portals", "Internal tools", "Operational software"],
    description:
      "Custom internal portals, real-time client management tools, and workflow engines designed around your actual operational bottlenecks.",
    spec: "AUTHENTICATION / WORKFLOW ENGINE / RBAC",
  },
  {
    number: "03",
    title: "AI & AUTOMATION",
    tags: ["AI workflows", "Automation", "AI assistants", "Intelligent processes"],
    description:
      "Production-grade AI assistants, data processing pipelines, and automated business integrations built for accuracy and privacy.",
    spec: "LLM PIPELINES / TASK QUEUES / EMBEDDINGS",
  },
  {
    number: "04",
    title: "SECURE INFRASTRUCTURE",
    tags: ["APIs", "Integrations", "Security", "Technical architecture"],
    description:
      "Robust API microservices, cloud deployments, and zero-trust security foundations engineered for long-term reliability and uptime.",
    spec: "ENCRYPTION / REST & GRAPHQL / ZERO TRUST",
  },
];

export function SystemsEditorial() {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  return (
    <section id="systems" className="py-24 md:py-36 bg-[#F5F4F0] border-b border-[#E0DDD6] selection:bg-[#FF4D00]/20">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-12 border-b border-[#E0DDD6] gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-[0.18em] text-[#5C5D61] mb-2">
              CAPABILITIES / SYSTEMS
            </div>
            <h2 className="text-4xl sm:text-6xl font-bold uppercase tracking-tight text-[#121316]">
              SYSTEMS WE ENGINEER
            </h2>
          </div>
          <div className="text-xs font-mono uppercase tracking-[0.14em] text-[#5C5D61]">
            04 CORE ARCHITECTURE MODULES
          </div>
        </div>

        {/* Editorial Rows */}
        <div className="divide-y divide-[#E0DDD6]">
          {systemsData.map((sys, idx) => {
            const isActive = activeIndex === idx;
            return (
              <div
                key={sys.number}
                onMouseEnter={() => setActiveIndex(idx)}
                className={`py-8 md:py-12 transition-all duration-300 cursor-pointer group ${
                  isActive ? "bg-[#EFECE5]/60 -mx-6 px-6 lg:-mx-12 lg:px-12" : ""
                }`}
              >
                <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
                  {/* Row Header & Number */}
                  <div className="lg:col-span-6 flex items-baseline gap-6">
                    <span
                      className={`text-sm font-mono tracking-[0.12em] transition-colors ${
                        isActive ? "text-[#FF4D00] font-semibold" : "text-[#5C5D61]"
                      }`}
                    >
                      {sys.number}
                    </span>

                    <h3
                      className={`text-2xl sm:text-4xl font-bold uppercase tracking-tight transition-colors flex items-center gap-3 ${
                        isActive ? "text-[#121316]" : "text-[#5C5D61] group-hover:text-[#121316]"
                      }`}
                    >
                      {isActive && <span className="signal-dot" />}
                      {sys.title}
                    </h3>
                  </div>

                  {/* Arrow Indicator */}
                  <div className="lg:col-span-6 flex items-center justify-between gap-4">
                    {/* Tags List */}
                    <div className="flex flex-wrap gap-2 text-xs font-mono uppercase tracking-[0.12em] text-[#5C5D61]">
                      {sys.tags.map((tag, tIdx) => (
                        <span key={tag}>
                          {tag}
                          {tIdx < sys.tags.length - 1 && <span className="mx-2 text-[#E0DDD6]">/</span>}
                        </span>
                      ))}
                    </div>

                    <ArrowUpRight
                      className={`size-6 transition-all duration-200 ${
                        isActive
                          ? "text-[#FF4D00] translate-x-1 -translate-y-1"
                          : "text-[#5C5D61] opacity-40 group-hover:opacity-100"
                      }`}
                    />
                  </div>
                </div>

                {/* Active Expanded Content */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden pt-6"
                    >
                      <div className="grid lg:grid-cols-12 gap-6 pt-4 border-t border-[#E0DDD6]/70">
                        <div className="lg:col-start-7 lg:col-span-6 space-y-3">
                          <p className="text-base text-[#5C5D61] leading-relaxed">
                            {sys.description}
                          </p>
                          <div className="text-xs font-mono uppercase tracking-[0.14em] text-[#FF4D00] pt-1">
                            SPEC: {sys.spec}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
