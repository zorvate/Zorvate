"use client";

import { motion } from "framer-motion";

export function PositioningSection() {
  return (
    <section className="py-28 md:py-40 bg-[#F5F4F0] border-b border-[#E0DDD6] selection:bg-[#FF4D00]/20">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="max-w-5xl space-y-12">
          {/* First Phrase */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-3xl sm:text-5xl lg:text-7xl font-bold uppercase tracking-tight text-[#121316] leading-[1.02]">
              WE DON&apos;T JUST MAKE
              <br />
              <span className="text-[#5C5D61]">DIGITAL PRODUCTS.</span>
            </h2>
          </motion.div>

          {/* Divider Dot / Line */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-24 h-[2px] bg-[#FF4D00] origin-left"
          />

          {/* Second Phrase */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-3xl sm:text-5xl lg:text-7xl font-bold uppercase tracking-tight text-[#121316] leading-[1.02]">
              WE ENGINEER
              <br />
              THE SYSTEM
              <br />
              BEHIND THEM.
            </h2>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
