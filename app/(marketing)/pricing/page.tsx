"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, Layers3, Gauge, ShieldCheck } from "lucide-react";

import { createClient } from "@/lib/supabase/browser";
import { getPricingPlans, getComparisons, PricingPlan, PricingComparison } from "@/lib/supabase/pricing";
import { getFaqs, Faq } from "@/lib/supabase/cms";
import { SectionWrapper } from "@/components/marketing/section-wrapper";
import { Button } from "@/components/ui/button";

export default function PricingPage() {
  const supabase = createClient();
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [comparisons, setComparisons] = useState<PricingComparison[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const loadedPlans = await getPricingPlans(supabase);
        const loadedComps = await getComparisons(supabase);
        const loadedFaqs = await getFaqs(supabase);
        setPlans(loadedPlans);
        setComparisons(loadedComps);
        setFaqs(loadedFaqs);
      } catch (e) {
        console.error("Error loading pricing data:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleFaq = (idx: number) => {
    setFaqOpen((current) => (current === idx ? null : idx));
  };

  return (
    <div className="bg-background relative min-h-screen text-foreground overflow-hidden">
      <section className="border-b border-border pt-32 pb-24">
        <SectionWrapper className="py-0">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div className="max-w-3xl space-y-5">
              <span className="mono-label text-[10px] text-primary">01 / Engagement Framework</span>
              <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                A pricing model designed around delivery architecture.
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                Whether a single sprint or a multi-system platform, each engagement is structured around a clear operating scope, delivery cadence, and long-term support path.
              </p>
            </div>
            <div className="panel-shell p-6">
              <div className="text-[10px] font-mono uppercase tracking-[0.24em] text-primary">Specification</div>
              <div className="mt-4 space-y-3 border-t border-border pt-4 text-sm text-muted-foreground">
                <div className="flex items-center justify-between border-b border-border/70 pb-3"><span>Scope</span><span className="text-foreground">Product / platform / AI</span></div>
                <div className="flex items-center justify-between border-b border-border/70 pb-3"><span>Cadence</span><span className="text-foreground">Sprint-led</span></div>
                <div className="flex items-center justify-between"><span>Support</span><span className="text-foreground">Operational continuity</span></div>
              </div>
            </div>
          </div>
        </SectionWrapper>
      </section>

      <SectionWrapper className="border-b border-border bg-surface/20">
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="space-y-4 lg:sticky lg:top-24">
            <span className="mono-label text-[10px] text-primary">02 / Delivery tiers</span>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Choose the level of operating support that fits your system.
            </h2>
            <p className="text-sm leading-7 text-muted-foreground">
              Each tier is shaped around the complexity of the product, the phase of growth, and the degree of operational oversight required.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {loading ? (
              <div className="md:col-span-2 xl:col-span-3 rounded-[var(--radius-md)] border border-border bg-surface/50 p-6 text-sm text-muted-foreground">
                Loading package options...
              </div>
            ) : (
              plans.slice().sort((a, b) => a.display_order - b.display_order).map((plan) => (
                <div key={plan.id} className={`panel-shell flex h-full flex-col justify-between p-6 ${plan.is_popular ? "border-primary/50" : ""}`}>
                  {plan.badge ? <div className="mb-4 text-[10px] font-mono uppercase tracking-[0.24em] text-primary">{plan.badge}</div> : null}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold tracking-tight text-foreground">{plan.name}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{plan.description}</p>
                    </div>
                    <div className="rounded-[var(--radius-md)] border border-border bg-surface/50 p-4">
                      <div className="text-[10px] font-mono uppercase tracking-[0.24em] text-muted-foreground">{plan.billing_label}</div>
                      <div className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                        {plan.price === 0 || plan.slug === "enterprise" ? "Custom quote" : `${plan.currency} ${plan.price.toLocaleString()}`}
                      </div>
                    </div>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {plan.features?.slice(0, 4).map((f) => (
                        <li key={f.id} className="flex items-start gap-2">
                          <Check className="mt-0.5 size-4 text-primary" />
                          <span>{f.feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button asChild size="sm" variant={plan.is_popular ? "default" : "engineering"} className="mt-6 w-full">
                    <Link href={plan.button_url}>{plan.button_text}</Link>
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper className="bg-background/70">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="panel-shell p-8">
            <div className="mb-6 text-[10px] font-mono uppercase tracking-[0.24em] text-primary">03 / Capability comparison</div>
            <div className="overflow-hidden rounded-[var(--radius-md)] border border-border">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-surface-secondary/70">
                  <tr>
                    <th className="px-4 py-3 text-[10px] font-mono uppercase tracking-[0.24em] text-muted-foreground">Capability</th>
                    <th className="px-4 py-3 text-[10px] font-mono uppercase tracking-[0.24em] text-muted-foreground">Starter</th>
                    <th className="px-4 py-3 text-[10px] font-mono uppercase tracking-[0.24em] text-muted-foreground">Business</th>
                    <th className="px-4 py-3 text-[10px] font-mono uppercase tracking-[0.24em] text-muted-foreground">Web App</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisons.map((row) => (
                    <tr key={row.id} className="border-t border-border/70">
                      <td className="px-4 py-3 text-foreground">{row.feature_name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.starter === "check" ? <Check className="size-4 text-primary" /> : row.starter}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.business === "check" ? <Check className="size-4 text-primary" /> : row.business}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.web_app === "check" ? <Check className="size-4 text-primary" /> : row.web_app}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="space-y-4">
            <div className="panel-shell p-8">
              <div className="text-[10px] font-mono uppercase tracking-[0.24em] text-primary">04 / Delivery assumptions</div>
              <div className="mt-4 space-y-4">
                <div className="flex items-start gap-3 rounded-[var(--radius-md)] border border-border bg-surface/50 p-4">
                  <Gauge className="mt-0.5 size-4 text-primary" />
                  <div>
                    <h3 className="text-sm font-semibold tracking-tight text-foreground">Execution cadence</h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">Delivery follows a defined sprint rhythm with measurable checkpoints.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-[var(--radius-md)] border border-border bg-surface/50 p-4">
                  <ShieldCheck className="mt-0.5 size-4 text-primary" />
                  <div>
                    <h3 className="text-sm font-semibold tracking-tight text-foreground">System integrity</h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">Architecture, access control, and lifecycle planning are built into each package.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-[var(--radius-md)] border border-border bg-surface/50 p-4">
                  <Layers3 className="mt-0.5 size-4 text-primary" />
                  <div>
                    <h3 className="text-sm font-semibold tracking-tight text-foreground">Scale path</h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">Projects can evolve into broader platform systems without re-architecture.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper className="bg-surface/20">
        <div className="rounded-[var(--radius-card)] border border-border bg-background/80 p-6 sm:p-8">
          <div className="max-w-2xl">
            <span className="mono-label text-[10px] text-primary">05 / FAQ</span>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Questions that surface before a build begins.</h2>
          </div>
          <div className="mt-8 space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = faqOpen === idx;
              return (
                <motion.div key={faq.id || idx} layout className="rounded-[var(--radius-md)] border border-border bg-surface/50 overflow-hidden">
                  <button onClick={() => toggleFaq(idx)} className="flex w-full items-center justify-between px-5 py-4 text-left">
                    <span className="text-sm font-semibold text-foreground">{faq.question}</span>
                    <motion.span animate={{ rotate: isOpen ? 180 : 0 }} className="text-primary"><ChevronDown size={15} /></motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-border/70 px-5 py-4">
                        <p className="text-sm leading-7 text-muted-foreground">{faq.answer}</p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}
