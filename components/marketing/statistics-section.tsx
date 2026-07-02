"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { SectionWrapper } from "./section-wrapper";
import { createClient } from "@/lib/supabase/browser";
import { getSiteSettings } from "@/lib/supabase/cms";

export function StatisticsSection() {
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    const supabase = createClient();
    async function loadSettings() {
      const s = await getSiteSettings(supabase);
      setSettings(s);
    }
    loadSettings();
  }, []);

  const renderValue = (val: string | undefined) => {
    if (!val || val === "—") return "—";
    const num = parseFloat(val.replace(/[^0-9.]/g, ""));
    if (isNaN(num)) return val;
    const suffix = val.replace(/[0-9.]/g, "");
    return (
      <CountUp
        end={num}
        decimals={val.includes(".") ? 1 : 0}
        duration={2.5}
        suffix={suffix}
        enableScrollSpy
        scrollSpyOnce
      />
    );
  };

  const stats = [
    { key: "satisfaction", label: "Client Satisfaction", desc: "Average client feedback score across all projects.", defaultVal: "—" },
    { key: "custom_software", label: "Custom Software", desc: "Bespoke SaaS platforms engineered for scale.", defaultVal: "—" },
    { key: "response_time", label: "Average Response", desc: "Average turn-around for client workspace inquiries.", defaultVal: "—" },
    { key: "countries_served", label: "Countries Served", desc: "Empowering founders and enterprise clients globally.", defaultVal: "—" },
  ];

  return (
    <SectionWrapper className="border-t bg-muted/10 relative overflow-hidden">
      {/* Aurora blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-6xl relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const rawVal = settings[stat.key] || stat.defaultVal;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4 }}
                className="text-center p-6 border rounded-2xl bg-background/50 hover:bg-card/50 backdrop-blur-md glass-panel hover:border-primary/10 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.15 + 0.1, duration: 0.6 }}
                    className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent"
                  >
                    {renderValue(rawVal)}
                  </motion.div>
                  <div className="mt-3 text-xs font-bold uppercase tracking-wider text-foreground">
                    {stat.label}
                  </div>
                </div>
                <p className="mt-4 text-xs text-muted-foreground leading-relaxed max-w-[200px] mx-auto">
                  {stat.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}
