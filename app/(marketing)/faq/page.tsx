"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { SectionWrapper } from "@/components/marketing/section-wrapper";
import { createClient } from "@/lib/supabase/browser";
import { getFaqs } from "@/lib/supabase/cms";

interface FaqItem {
  question: string;
  answer: string;
}

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const supabase = createClient();
    void getFaqs(supabase).then((data) => setFaqs(data.slice(0, 6))).catch(() => setFaqs([]));
  }, []);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SectionWrapper>
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-sm font-semibold tracking-wider text-primary uppercase">
            FAQ
          </span>
          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Everything you need to know about our web development process, tech stack, and billing systems.
          </p>
        </div>
      </SectionWrapper>

      <SectionWrapper className="border-t bg-muted/10 flex-1">
        <div className="mx-auto max-w-3xl space-y-4">
          {faqs.length > 0 ? (
            faqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="border bg-background rounded-xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggle(idx)}
                    className="w-full flex items-center justify-between p-6 text-left font-semibold hover:bg-muted/30 transition-colors"
                  >
                    <span className="text-foreground tracking-tight">{faq.question}</span>
                    {isOpen ? (
                      <Minus size={18} className="text-primary flex-shrink-0" />
                    ) : (
                      <Plus size={18} className="text-primary flex-shrink-0" />
                    )}
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="px-6 pb-6 text-sm leading-relaxed text-muted-foreground border-t pt-4">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          ) : (
            <div className="rounded-xl border border-dashed border-border/60 bg-background/70 p-8 text-center text-sm text-muted-foreground">
              FAQ content will appear here once questions are published from the admin CMS.
            </div>
          )}
        </div>
      </SectionWrapper>
    </div>
  );
}
