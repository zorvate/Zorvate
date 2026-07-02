"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { SectionWrapper } from "@/components/marketing/section-wrapper";

const faqs = [
  {
    question: "What technologies do you use for development?",
    answer: "We build primarily with Next.js 15, TypeScript (under strict typing guidelines), Tailwind CSS v4, and Supabase for database integration. This ensures your project is secure, modern, and easily maintainable.",
  },
  {
    question: "How long does a typical SaaS project take to complete?",
    answer: "A standard Version 1 application normally takes between 4 to 8 weeks to build, test, and deploy. Custom workflows or complex integrations might extend this timeline.",
  },
  {
    question: "Can I manage projects and view invoices online?",
    answer: "Yes. Once you sign up, you get full access to the Client Portal. There, you can chat with the developer team, upload and view files, inspect the milestone timelines, and manage invoices.",
  },
  {
    question: "How is payment structured?",
    answer: "We typically charge a 50% deposit to initiate the planning/design phase, with the remaining 50% due upon production launch and handoff of the codebase.",
  },
  {
    question: "Do you offer post-launch support?",
    answer: "Yes, we offer monthly retainer packages to cover server maintenance, security patches, regular backups, and incremental feature updates.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
          {faqs.map((faq, idx) => {
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
          })}
        </div>
      </SectionWrapper>
    </div>
  );
}
