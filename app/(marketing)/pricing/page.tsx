"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Sparkles, ChevronDown, HelpCircle } from "lucide-react";

import { createClient } from "@/lib/supabase/browser";
import { getPricingPlans, getComparisons, PricingPlan, PricingComparison } from "@/lib/supabase/pricing";
import { getFaqs, Faq } from "@/lib/supabase/cms";
import { SectionWrapper } from "@/components/marketing/section-wrapper";
import { GlassCard } from "@/components/ui/glass-card";
import { SpotlightGlow } from "@/components/ui/spotlight-glow";
import { ParticlesBackdrop } from "@/components/ui/particles-backdrop";
import { Magnetic } from "@/components/ui/magnetic";



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
    setFaqOpen(faqOpen === idx ? null : idx);
  };

  const getGradientClass = (color: string) => {
    switch (color) {
      case "accent":
        return "from-pink-500 via-purple-500 to-indigo-500";
      case "violet":
        return "from-purple-600 via-indigo-600 to-blue-600";
      case "emerald":
        return "from-emerald-500 via-teal-500 to-cyan-500";
      default:
        return "from-indigo-600 via-purple-600 to-pink-600";
    }
  };

  return (
    <div className="bg-background relative min-h-screen text-foreground overflow-hidden">
      {/* HERO SECTION */}
      <SpotlightGlow
        radius={700}
        glowColor="rgba(109, 40, 217, 0.08)"
        className="relative overflow-hidden border-b"
      >
        <SectionWrapper className="py-24 md:py-32 relative z-10">
          <ParticlesBackdrop quantity={60} />
          
          <div className="absolute top-12 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-16 right-1/4 w-[480px] h-[480px] rounded-full bg-accent/5 blur-[130px] pointer-events-none" />

          <div className="mx-auto max-w-4xl text-center relative z-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20 select-none shadow-sm flex items-center gap-1.5 w-fit mx-auto">
              <Sparkles size={11} className="animate-pulse" />
              <span>Database Driven Rates</span>
            </span>
            <h1 className="text-4xl sm:text-7xl font-black tracking-tight text-foreground mt-8 leading-none">
              Transparent Pricing for <br className="hidden sm:inline" />
              Every Stage of Growth
            </h1>
            <p className="mt-6 text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
              Whether you&apos;re launching your first startup or scaling an established business, Zorvate delivers premium software solutions at startup-friendly prices.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Magnetic>
                <Link
                  href="/contact"
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-6 text-xs font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all"
                >
                  Get a Quote
                </Link>
              </Magnetic>
              <Magnetic>
                <Link
                  href="/contact"
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-border/80 bg-background/50 hover:bg-muted px-6 text-xs font-bold transition-all text-muted-foreground hover:text-foreground"
                >
                  Schedule a Consultation
                </Link>
              </Magnetic>
            </div>
          </div>
        </SectionWrapper>
      </SpotlightGlow>

      {/* PRICING CARDS */}
      <SectionWrapper className="py-20 relative z-10 border-t bg-muted/5">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <p className="text-xs text-muted-foreground font-mono">Synchronizing Plans Desk...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mx-auto max-w-7xl">
            {plans
              .slice()
              .sort((a, b) => a.display_order - b.display_order)
              .map((plan) => (
              <GlassCard
                key={plan.id}
                tilt={true}
                tiltMaxAngle={4}
                glowColor={plan.is_popular ? "accent" : "primary"}
                className={`p-6 border bg-card/25 flex flex-col justify-between relative hover:-translate-y-1 transition-all duration-500 ${
                  plan.is_popular ? "border-primary/50 shadow-lg shadow-primary/5" : "border-border/60"
                }`}
              >
                {/* Most Popular Badge */}
                {plan.badge && (
                  <span className={`absolute -top-3 right-6 text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full text-white bg-gradient-to-r ${getGradientClass(plan.gradient)} shadow-md`}>
                    {plan.badge}
                  </span>
                )}

                <div>
                  <h3 className="text-lg font-black text-foreground">{plan.name}</h3>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed font-medium min-h-[48px]">
                    {plan.description}
                  </p>

                  {/* Price info */}
                  <div className="mt-6 flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider leading-none">
                      {plan.billing_label}
                    </span>
                    <div className="flex items-baseline text-foreground mt-2 font-mono">
                      {plan.price === 0 || plan.slug === "enterprise" ? (
                        <span className="text-2xl font-black tracking-tight uppercase">Custom Quote</span>
                      ) : (
                        <>
                          <span className="text-sm font-bold mr-0.5">{plan.currency} </span>
                          <span className="text-4xl font-black tracking-tight">{plan.price.toLocaleString()}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Features list */}
                  <ul className="mt-8 space-y-3.5 border-t border-border/40 pt-6">
                    {plan.features?.map((f) => (
                      <li key={f.id} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                        <span className="mt-0.5 p-0.5 rounded-full bg-primary/10 text-primary flex-shrink-0">
                          <Check size={11} />
                        </span>
                        <span className="font-semibold leading-tight">{f.feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4">
                  <Magnetic>
                    <Link
                      href={plan.button_url}
                      className={`flex h-11 items-center justify-center rounded-xl text-xs font-bold transition-all w-full shadow-md ${
                        plan.is_popular
                          ? "bg-primary text-primary-foreground shadow-primary/20 hover:brightness-110"
                          : "border border-border/80 bg-background/50 hover:bg-muted text-foreground"
                      }`}
                    >
                      {plan.button_text}
                    </Link>
                  </Magnetic>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </SectionWrapper>

      {/* FEATURE COMPARISON TABLE */}
      <SectionWrapper className="py-20 border-t relative z-10 bg-muted/10">
        <div className="mx-auto max-w-5xl space-y-12">
          <div className="text-center select-none">
            <span className="text-[9px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
              Deep Sync Grid
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground mt-4">Features Comparison</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2 font-medium">
              Analyze included engineering features across all standard package sprints.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-border/80 bg-card/25 backdrop-blur-md">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-border/60 bg-white/5">
                    <th className="p-4 text-xs font-black uppercase tracking-wider text-muted-foreground">Capabilities</th>
                    <th className="p-4 text-xs font-black uppercase tracking-wider text-foreground text-center">Starter</th>
                    <th className="p-4 text-xs font-black uppercase tracking-wider text-foreground text-center">Business</th>
                    <th className="p-4 text-xs font-black uppercase tracking-wider text-foreground text-center">Web App</th>
                    <th className="p-4 text-xs font-black uppercase tracking-wider text-foreground text-center">AI Integration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 font-semibold text-xs text-muted-foreground">
                  {comparisons.map((row) => {
                    const renderCell = (val: string) => {
                      if (val === "check") {
                        return <Check size={15} className="text-primary mx-auto" />;
                      }
                      if (val === "cross") {
                        return <X size={15} className="text-muted-foreground/35 mx-auto" />;
                      }
                      return <span className="text-[11px] text-foreground font-bold">{val}</span>;
                    };

                    return (
                      <tr key={row.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 text-foreground font-bold">{row.feature_name}</td>
                        <td className="p-4 text-center">{renderCell(row.starter)}</td>
                        <td className="p-4 text-center">{renderCell(row.business)}</td>
                        <td className="p-4 text-center">{renderCell(row.web_app)}</td>
                        <td className="p-4 text-center">{renderCell(row.ai)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </SectionWrapper>

      {/* FAQ SECTION */}
      <SectionWrapper className="py-20 border-t relative z-10 bg-muted/5">
        <div className="mx-auto max-w-3xl space-y-12">
          <div className="text-center select-none">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Frequently Answered Queries</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2 font-medium">
              Transparent parameters regarding scope changes, integrations, and server synchronization cycles.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = faqOpen === idx;
              return (
                <div
                  key={faq.id || idx}
                  className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                    isOpen ? "bg-card/45 border-primary/20" : "bg-card/20 border-border/80 hover:border-border"
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-5 text-left font-bold text-sm text-foreground select-none cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5">
                      <HelpCircle size={16} className="text-primary flex-shrink-0" />
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-muted-foreground"
                    >
                      <ChevronDown size={16} />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 text-xs sm:text-sm text-muted-foreground leading-relaxed font-semibold">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </SectionWrapper>

      {/* CTA SECTION */}
      <SectionWrapper className="py-20 border-t relative z-10 bg-muted/10">
        <div className="mx-auto max-w-4xl">
          <GlassCard
            tilt={false}
            className="p-10 border bg-card/25 text-center relative overflow-hidden space-y-6"
          >
            {/* Background gradient lighting highlight */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-primary/10 blur-[80px] pointer-events-none" />

            <div className="space-y-3 relative z-10">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                Have a unique project?
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed font-medium">
                Let&apos;s build something exceptional together. We configure secure client portals, custom dashboards, and high-performance platforms tailored to your budget constraints.
              </p>
            </div>

            <div className="pt-4 flex flex-wrap justify-center gap-4 relative z-10">
              <Magnetic>
                <Link
                  href="/contact"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-xs font-bold text-primary-foreground shadow-md shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all"
                >
                  Request Custom Quote
                </Link>
              </Magnetic>
              <Magnetic>
                <Link
                  href="/contact"
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-border/80 bg-background/50 hover:bg-muted px-6 text-xs font-bold transition-all text-muted-foreground hover:text-foreground"
                >
                  Book a Discovery Call
                </Link>
              </Magnetic>
            </div>
          </GlassCard>
        </div>
      </SectionWrapper>
    </div>
  );
}
