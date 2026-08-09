"use client";

import { motion } from "framer-motion";

interface Principle {
  code: string;
  title: string;
  tagline: string;
  body: string;
}

const principles: Principle[] = [
  {
    code: "01",
    title: "PRECISION",
    tagline: "Every detail has a reason.",
    body:
      "We don't add elements without purpose. Every design decision, every API endpoint, every data model is justified by operational need.",
  },
  {
    code: "02",
    title: "SYSTEMS",
    tagline: "Everything connects.",
    body:
      "We build architecture, not features. The measure of our work isn't whether something works in isolation — it's whether it makes the whole system stronger.",
  },
  {
    code: "03",
    title: "CLARITY",
    tagline: "No ambiguity in delivery.",
    body:
      "Clean code, clear contracts, documented decisions. Your team should be able to maintain, extend, and audit everything we build — without us in the room.",
  },
  {
    code: "04",
    title: "SECURITY",
    tagline: "Engineered from the ground up.",
    body:
      "Security is a first-class architectural concern, not a layer bolted on after. Zero-trust boundaries, encrypted data, and row-level access controls are baseline.",
  },
];

export function EngineeringPrinciplesEditorial() {
  return (
    <section className="bg-[#121316] text-[#F5F4F0] selection:bg-[#FF4D00]/30 overflow-hidden relative grid-line-pattern-dark border-b border-[#28292E]">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 py-20 md:py-28 lg:py-32">

        {/* Section Header */}
        <div className="pb-6 border-b border-[#28292E]">
          <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-[#FF4D00]">
            CORE DISCIPLINES
          </h2>
        </div>

        {/* Headline */}
        <div className="py-12 md:py-16 border-b border-[#28292E] grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold uppercase tracking-tight text-[#F5F4F0] leading-[0.95]">
              COMPLEX
              <br />
              PROBLEMS.
              <br />
              <span className="text-[#8E8F94]">CLEAR</span>
              <br />
              SYSTEMS.
            </h2>
          </div>

          <div className="lg:col-span-4 text-sm text-[#8E8F94] leading-relaxed max-w-sm font-normal">
            Four principles that govern every system we engineer. Not aspirational values — operational constraints that determine every decision we make.
          </div>
        </div>

        {/* Principles Grid — 2x2 on desktop, stacked on mobile */}
        <div className="pt-10 md:pt-12 grid gap-6 sm:grid-cols-2">
          {principles.map((p, idx) => (
            <motion.div
              key={p.code}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.6,
                delay: idx * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group p-8 border border-[#28292E] bg-[#18191D]/80 hover:border-[#FF4D00]/40 transition-colors space-y-4"
            >
              {/* Header row */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono tracking-[0.18em] text-[#FF4D00]">
                  {p.code}
                </span>
                <span className="signal-dot opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Title */}
              <h3 className="text-3xl font-bold uppercase tracking-tight text-[#F5F4F0]">
                {p.title}
              </h3>

              {/* Tagline */}
              <p className="text-sm text-[#8E8F94] font-medium leading-normal border-t border-[#28292E] pt-4">
                {p.tagline}
              </p>

              {/* Body */}
              <p className="text-sm text-[#5C5D61] leading-relaxed">
                {p.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
