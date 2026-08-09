"use client";

import { useState, useRef } from "react";

const systemLayers = [
  {
    id: "website",
    num: "01",
    label: "WEBSITE",
    sublabel: "Digital front-end",
    spec: "Next.js / TypeScript / Tailwind",
  },
  {
    id: "data",
    num: "02",
    label: "DATA",
    sublabel: "Structured database",
    spec: "Supabase / PostgreSQL / RLS",
  },
  {
    id: "automation",
    num: "03",
    label: "AUTOMATION",
    sublabel: "Workflow engine",
    spec: "Edge Functions / Webhooks / Queues",
  },
  {
    id: "ai",
    num: "04",
    label: "AI",
    sublabel: "Intelligence layer",
    spec: "LLM APIs / Embeddings / Agents",
  },
  {
    id: "operations",
    num: "05",
    label: "OPERATIONS",
    sublabel: "Business output",
    spec: "Dashboards / Reports / Alerts",
  },
];

const connectorLabels = ["READS & WRITES", "TRIGGERS", "FEEDS", "POWERS"];

export function ZorvateSystemSection() {
  const [activeNode, setActiveNode] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={containerRef}
      className="bg-[#121316] border-b border-[#28292E] selection:bg-[#FF4D00]/30 overflow-hidden relative grid-line-pattern-dark"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 py-20 md:py-28 lg:py-32">

        {/* Chapter Label */}
        <div className="flex items-center justify-between pb-8 border-b border-[#28292E]">
          <div className="text-xs font-mono uppercase tracking-[0.18em] text-[#F5F4F0] flex items-center gap-2">
            <span className="signal-dot" />
            TECHNICAL CONTROL LAYER
          </div>
          <div className="text-xs font-mono uppercase tracking-[0.14em] text-[#8E8F94]">
            PROXIMITY-ACTIVATED FLOW
          </div>
        </div>

        {/* Headline */}
        <div className="py-8 md:py-10 grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-[#F5F4F0] leading-[1.0]">
              THE ZORVATE
              <br />
              <span className="text-[#8E8F94]">SYSTEM.</span>
            </h2>
          </div>
          <div className="lg:col-span-5 text-sm text-[#8E8F94] leading-relaxed">
            Hover or touch any node to inspect data flow. Website captures data. Data triggers automation. Automation feeds AI. AI powers operations.
          </div>
        </div>

        {/* DESKTOP: Architectural Diagram */}
        <div className="hidden lg:block pt-4">
          {/* Nodes */}
          <div className="grid grid-cols-5 gap-0">
            {systemLayers.map((layer, idx) => {
              const isActive = activeNode === idx;
              const isAdjacent = activeNode !== null && Math.abs(activeNode - idx) === 1;

              return (
                <div
                  key={layer.id}
                  onMouseEnter={() => setActiveNode(idx)}
                  onMouseLeave={() => setActiveNode(null)}
                  className={`relative p-6 border-t border-b border-l ${
                    idx === systemLayers.length - 1 ? "border-r" : ""
                  } border-[#28292E] transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-[#18191D] border-[#FF4D00] z-20 scale-[1.02] shadow-lg"
                      : isAdjacent
                      ? "bg-[#18191D]/90 border-[#8E8F94]/40 z-10"
                      : "bg-[#18191D]/50 border-[#28292E] opacity-75"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono tracking-[0.18em] text-[#FF4D00]">
                      {layer.num}
                    </span>
                    <span
                      className={`signal-dot transition-opacity ${
                        isActive ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  </div>
                  <h3 className="text-xl font-bold uppercase tracking-tight text-[#F5F4F0] mb-1">
                    {layer.label}
                  </h3>
                  <div className="text-xs font-mono uppercase tracking-[0.1em] text-[#8E8F94] mb-4">
                    {layer.sublabel}
                  </div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.08em] text-[#5C5D61] leading-relaxed">
                    {layer.spec}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Flow Connector Line Row */}
          <div className="grid grid-cols-5 gap-0 mt-2">
            {connectorLabels.map((label, idx) => {
              const isFlowActive =
                activeNode === idx || activeNode === idx + 1;

              return (
                <div key={label} className="relative flex items-center h-10 px-2">
                  <div className="w-full h-[1px] bg-[#28292E] relative overflow-hidden">
                    <div
                      className={`absolute inset-0 bg-[#FF4D00] transition-all duration-300 ${
                        isFlowActive ? "opacity-100 scale-x-100" : "opacity-20 scale-x-50"
                      }`}
                    />
                  </div>
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] font-mono uppercase tracking-[0.14em] text-[#8E8F94] whitespace-nowrap bg-[#121316] px-1">
                    {label}
                  </div>
                </div>
              );
            })}
            <div />
          </div>
        </div>

        {/* MOBILE: Vertical Stack */}
        <div className="lg:hidden space-y-0 divide-y divide-[#28292E] border-t border-[#28292E]">
          {systemLayers.map((layer, idx) => (
            <div
              key={layer.id}
              onClick={() => setActiveNode(activeNode === idx ? null : idx)}
              className={`py-6 flex items-start gap-6 transition-colors ${
                activeNode === idx ? "bg-[#18191D]/80 -mx-6 px-6" : ""
              }`}
            >
              <div className="text-xs font-mono tracking-[0.18em] text-[#FF4D00] pt-0.5 shrink-0 w-6">
                {layer.num}
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold uppercase tracking-tight text-[#F5F4F0]">
                  {layer.label}
                </h3>
                <div className="text-xs font-mono uppercase tracking-[0.1em] text-[#8E8F94]">
                  {layer.sublabel}
                </div>
                <div className="text-[10px] font-mono uppercase tracking-[0.08em] text-[#5C5D61]">
                  {layer.spec}
                </div>
                {idx < connectorLabels.length && (
                  <div className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#FF4D00]/60 pt-2">
                    ↓ {connectorLabels[idx]}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="mt-12 pt-8 border-t border-[#28292E] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-sm text-[#8E8F94] max-w-lg leading-relaxed">
            Every system we build is engineered as a complete architecture — not a collection of disconnected tools.
          </p>
          <div className="flex items-center gap-2.5 text-xs font-mono uppercase tracking-[0.14em] text-[#FF4D00]">
            <span className="signal-dot" />
            <span>ARCHITECTURE LIVE</span>
          </div>
        </div>
      </div>
    </section>
  );
}
