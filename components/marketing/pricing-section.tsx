"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { SectionWrapper } from "./section-wrapper";

const plans = [
  {
    name: "Starter",
    price: "Custom",
    description: "Perfect for startups and small businesses.",
    features: [
      "Responsive website",
      "SEO foundation",
      "Contact form",
      "Modern UI",
    ],
  },
  {
    name: "Professional",
    price: "Custom",
    description: "Ideal for growing businesses looking for full scale.",
    features: [
      "Everything in Starter",
      "CMS integration",
      "Admin dashboard",
      "Authentication",
      "Supabase backend",
    ],
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Let's Talk",
    description: "For complex systems and custom SaaS products.",
    features: [
      "Everything in Professional",
      "Client Portal workspace",
      "Custom API integrations",
      "Dedicated tech scope",
      "Priority launch support",
    ],
  },
];

export function PricingSection() {
  return (
    <SectionWrapper id="pricing" className="border-t bg-muted/5 relative overflow-hidden">
      {/* Decorative Blob */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full"
          >
            Pricing Models
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight text-foreground"
          >
            Flexible Solutions
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-muted-foreground text-base leading-relaxed"
          >
            Every project is unique. We&apos;ll recommend the best features and database setup for your business scale.
          </motion.p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 items-stretch">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              whileHover={{ y: -8 }}
              className={`rounded-2xl border p-8 flex flex-col justify-between transition-all duration-300 relative glass-panel ${
                plan.featured
                  ? "border-primary shadow-xl shadow-primary/5 bg-background/80 dark:bg-card/40 z-10"
                  : "border-border bg-background/50"
              }`}
            >
              {plan.featured && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-widest text-primary-foreground bg-primary px-3 py-1 rounded-full shadow-md">
                  Most Popular
                </span>
              )}

              <div>
                <h3 className="text-xl font-bold tracking-tight text-foreground">
                  {plan.name}
                </h3>

                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold tracking-tight text-foreground">
                    {plan.price}
                  </span>
                </div>

                <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                  {plan.description}
                </p>

                <ul className="mt-8 space-y-3.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="text-xs text-foreground flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                        <Check size={12} strokeWidth={3} />
                      </span>
                      <span className="text-muted-foreground font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t">
                <Link
                  href="/contact"
                  className={`inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-center text-xs font-bold transition-all duration-300 glow-btn ${
                    plan.featured
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/10"
                      : "bg-secondary text-secondary-foreground hover:bg-muted"
                  }`}
                >
                  Request Quote
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
