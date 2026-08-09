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
    return <CountUp end={num} decimals={val.includes(".") ? 1 : 0} duration={2} suffix={suffix} enableScrollSpy scrollSpyOnce />;
  };

  const stats = [
    { key: "satisfaction", label: "Client Satisfaction", desc: "Average feedback score across all deliverables.", defaultVal: "—" },
    { key: "custom_software", label: "Custom Software", desc: "Bespoke SaaS platforms engineered for scale.", defaultVal: "—" },
    { key: "response_time", label: "Average Response", desc: "Client portal turn-around SLA.", defaultVal: "—" },
    { key: "countries_served", label: "Global Reach", desc: "Empowering founders and clients globally.", defaultVal: "—" },
  ];

  return (
    <SectionWrapper className="border-b border-border bg-background/80">
      <div className="rounded-[var(--radius-card)] border border-border bg-surface/50 p-4 sm:p-6">
        <div className="mb-6 max-w-2xl">
          <span className="mono-label text-[10px] text-primary">05 / System Telemetry</span>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Operational data, not vanity metrics.</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, idx) => {
            const rawVal = settings[stat.key] || stat.defaultVal;
            return (
              <motion.div key={idx} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.05, duration: 0.35 }} className="panel-shell p-5">
                <div className="text-3xl font-semibold tracking-tight text-foreground font-mono sm:text-4xl">{renderValue(rawVal)}</div>
                <div className="mt-3 text-[10px] font-mono uppercase tracking-[0.24em] text-primary">{stat.label}</div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{stat.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}
