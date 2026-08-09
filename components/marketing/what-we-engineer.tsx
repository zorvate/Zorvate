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

export function WhatWeEngineer() {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const systemsData: SystemItem[] = [
    {
      number: "01",
      title: "DIGITAL PRODUCTS",
      tags: ["Websites", "Landing systems", "E-commerce", "Digital experiences"],
      description:
        "High-assurance web platforms engineered for speed, search prominence, and conversion. Every line of markup has a purpose.",
      spec: "NEXT.JS / SSR / EDGE DEPLOYMENT / WCAG",
    },
    {
      number: "02",
      title: "BUSINESS SYSTEMS",
      tags: ["Dashboards", "Client portals", "Internal tools", "Operational software"],
      description:
        "Custom portals, real-time client management tools, and workflow engines designed around your actual operational bottlenecks.",
      spec: "SUPABASE / RBAC / REAL-TIME / MULTI-TENANT",
    },
    {
      number: "03",
      title: "AI & AUTOMATION",
      tags: ["AI workflows", "Automation pipelines", "AI assistants", "Intelligent processes"],
      description:
        "Production-grade AI assistants, data processing pipelines, and automated integrations built for accuracy and operational scale.",
      spec: "LLM APIS / TASK QUEUES / EMBEDDINGS / AGENTS",
    },
    {
      number: "04",
      title: "SECURE INFRASTRUCTURE",
      tags: ["APIs", "Integrations", "Security", "Technical architecture"],
      description:
        "Robust API microservices, cloud deployments, and zero-trust security foundations engineered for long-term reliability.",
      spec: "ZERO TRUST / REST & GRAPHQL / ENCRYPTION / MONITORING",
    },
  ];

  return (
    <section
      id="systems"
      className="py-20 md:py-28 lg:py-32 bg-[#F5F4F0] border-b border-[#E0DDD6] selection:bg-[#FF4D00]/20"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="pb-6 md:pb-8 border-b border-[#E0DDD6] mb-8">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-[#121316]">
            WHAT WE ENGINEER
          </h2>
        </div>

        {/* Editorial Rows */}
        <div className="divide-y divide-[#E0DDD6]">
          {systemsData.map((sys, idx) => {
            const isActive = activeIndex === idx;
            return (
              <div
                key={sys.number}
                onMouseEnter={() => setActiveIndex(idx)}
                className={`py-6 md:py-9 transition-all duration-300 cursor-pointer group ${
                  isActive ? "bg-[#EFECE5]/60 -mx-6 px-6 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12" : ""
                }`}
              >
                <div className="grid gap-4 lg:grid-cols-12 lg:items-center">
                  {/* Number + Title */}
                  <div className="lg:col-span-6 flex items-baseline gap-6">
                    <span
                      className={`text-sm font-mono tracking-[0.12em] transition-colors shrink-0 ${
                        isActive ? "text-[#FF4D00] font-semibold" : "text-[#5C5D61]"
                      }`}
                    >
                      {sys.number}
                    </span>

                    <h3
                      className={`text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-tight transition-colors flex items-center gap-3 ${
                        isActive
                          ? "text-[#121316]"
                          : "text-[#5C5D61] group-hover:text-[#121316]"
                      }`}
                    >
                      {isActive && <span className="signal-dot shrink-0" />}
                      {sys.title}
                    </h3>
                  </div>

                  {/* Tags + Arrow */}
                  <div className="lg:col-span-6 flex items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-mono uppercase tracking-[0.1em] text-[#5C5D61]">
                      {sys.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>

                    <ArrowUpRight
                      className={`size-5 shrink-0 transition-all duration-200 ${
                        isActive
                          ? "text-[#FF4D00] translate-x-0.5 -translate-y-0.5"
                          : "text-[#5C5D61] opacity-40 group-hover:opacity-100"
                      }`}
                    />
                  </div>
                </div>

                {/* Expanded content on active */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="grid lg:grid-cols-12 gap-6 pt-6 mt-6 border-t border-[#E0DDD6]/60">
                        <div className="lg:col-start-7 lg:col-span-6 space-y-3">
                          <p className="text-base text-[#5C5D61] leading-relaxed">
                            {sys.description}
                          </p>
                          <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#FF4D00]">
                            STACK — {sys.spec}
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
