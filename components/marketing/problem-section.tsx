"use client";

import { motion } from "framer-motion";

// Before: scattered, manual, disconnected
const beforeItems = [
  { label: "Spreadsheets", detail: "Client data in Google Sheets, updated manually" },
  { label: "Email threads", detail: "Project status buried in inboxes" },
  { label: "WhatsApp", detail: "Approvals and files lost in chat" },
  { label: "Paper invoices", detail: "Manually typed, no tracking" },
  { label: "No visibility", detail: "Owner can't see what's happening" },
];

// After: the connected system
const afterItems = [
  { label: "Single dashboard", detail: "All client data, live and searchable" },
  { label: "Automated updates", detail: "Status changes trigger notifications instantly" },
  { label: "Secure portal", detail: "Files, approvals, messaging — one place" },
  { label: "Auto-invoicing", detail: "Generated, sent, tracked automatically" },
  { label: "Full visibility", detail: "Owner sees everything in real time" },
];

export function ProblemSection() {
  return (
    <section className="bg-[#F5F4F0] border-b border-[#E0DDD6] selection:bg-[#FF4D00]/20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 py-20 md:py-28 lg:py-32">

        {/* Header Label */}
        <div className="flex items-center justify-between pb-8 border-b border-[#E0DDD6]">
          <div className="text-xs font-mono uppercase tracking-[0.18em] text-[#FF4D00] flex items-center gap-2">
            <span className="signal-dot" />
            SYSTEM DISCONNECT
          </div>
          <div className="text-xs font-mono uppercase tracking-[0.14em] text-[#5C5D61]">
            FRAGMENTS VS ARCHITECTURE
          </div>
        </div>

        {/* Main Statement — Asymmetric Editorial Grid */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="py-12 md:py-16 grid gap-8 lg:grid-cols-12 lg:items-end"
        >
          <div className="lg:col-span-8">
            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold uppercase tracking-tight text-[#121316] leading-[1.02]">
              YOUR BUSINESS{" "}
              <span className="text-[#5C5D61]">ALREADY HAS A SYSTEM.</span>
              <br />
              IT&apos;S JUST NOT{" "}
              <span className="relative inline-block">
                CONNECTED.
                <span className="absolute bottom-1 left-0 w-full h-[3px] bg-[#FF4D00]" />
              </span>
            </h2>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <p className="text-sm text-[#5C5D61] leading-relaxed font-normal">
              Most businesses operate across isolated tools — spreadsheets, inboxes, manual messaging, untracked invoices. We replace fragments with connected digital infrastructure.
            </p>
          </div>
        </motion.div>

        {/* Before / After Grid */}
        <div className="grid gap-8 lg:grid-cols-2">

          {/* BEFORE: Manual / Broken */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="border border-[#E0DDD6] bg-[#EFECE5]/40 p-6 sm:p-8 space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-[#C8C4BB] rounded-none" />
              <span className="text-xs font-mono uppercase tracking-[0.18em] text-[#5C5D61]">
                BEFORE ZORVATE
              </span>
            </div>

            <div className="space-y-0 divide-y divide-[#E0DDD6]">
              {beforeItems.map((item, idx) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.06, duration: 0.35 }}
                  className="py-3.5 grid grid-cols-[110px_1fr] sm:grid-cols-[120px_1fr] gap-4 items-start"
                >
                  <span className="text-xs font-mono uppercase tracking-[0.1em] text-[#5C5D61] line-through decoration-[#C8C4BB]">
                    {item.label}
                  </span>
                  <span className="text-sm text-[#84858A] leading-snug">
                    {item.detail}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* AFTER: Connected System */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="border border-[#121316] bg-[#121316] p-6 sm:p-8 space-y-6"
          >
            <div className="flex items-center gap-3">
              <span className="signal-dot" />
              <span className="text-xs font-mono uppercase tracking-[0.18em] text-[#F5F4F0]">
                AFTER ZORVATE
              </span>
            </div>

            <div className="space-y-0 divide-y divide-[#28292E]">
              {afterItems.map((item, idx) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.12 + idx * 0.06, duration: 0.35 }}
                  className="py-3.5 grid grid-cols-[110px_1fr] sm:grid-cols-[120px_1fr] gap-4 items-start"
                >
                  <span className="text-xs font-mono uppercase tracking-[0.1em] text-[#FF4D00]">
                    {item.label}
                  </span>
                  <span className="text-sm text-[#8E8F94] leading-snug">
                    {item.detail}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Summary Statement */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 text-xs sm:text-sm text-[#5C5D61] max-w-xl leading-relaxed font-mono uppercase tracking-[0.1em]"
        >
          We don&apos;t sell websites. We engineer the digital infrastructure that makes your business operate as a connected system.
        </motion.p>
      </div>
    </section>
  );
}
