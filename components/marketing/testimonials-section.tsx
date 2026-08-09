"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SectionWrapper } from "./section-wrapper";
import { createClient } from "@/lib/supabase/browser";
import { getTestimonials } from "@/lib/supabase/cms";

interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
}

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);

  useEffect(() => {
    const supabase = createClient();
    void getTestimonials(supabase)
      .then((data) => setTestimonials(data.slice(0, 4)))
      .catch(() => setTestimonials([]));
  }, []);

  return (
    <SectionWrapper className="border-b border-border bg-background/70">
      <div className="rounded-[var(--radius-card)] border border-border bg-surface/50 p-5 sm:p-8">
        <div className="mb-8 max-w-2xl">
          <span className="mono-label text-[10px] text-primary">06 / Partner Verification</span>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Evidence from teams operating at high complexity.</h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {testimonials.map((t, idx) => (
            <motion.div key={t.name} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.05, duration: 0.35 }} className="panel-shell p-5">
              <p className="text-sm leading-7 text-muted-foreground">“{t.text}”</p>
              <div className="mt-6 flex items-center gap-3 border-t border-border/70 pt-4">
                <div className="flex size-9 items-center justify-center rounded-full border border-border bg-surface-secondary font-mono text-sm font-semibold text-primary">{t.name.charAt(0)}</div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{t.name}</div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.24em] text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
