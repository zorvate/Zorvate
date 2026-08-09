"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Cpu, Palette, Layers, LayoutDashboard, Plug, Zap, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { SectionWrapper } from "./section-wrapper";
import { createClient } from "@/lib/supabase/browser";
import { getServices } from "@/lib/supabase/cms";

const SERVICE_ICONS = [Cpu, Palette, Layers, LayoutDashboard, Plug, Zap];

interface ServiceItem {
  title: string;
  shortDescription?: string;
  description?: string;
  slug?: string;
}

export function ServicesSection() {
  const [services, setServices] = useState<ServiceItem[]>([]);

  useEffect(() => {
    const supabase = createClient();
    void getServices(supabase)
      .then((data) => setServices(data.slice(0, 6)))
      .catch(() => setServices([]));
  }, []);

  return (
    <SectionWrapper id="services" className="border-b border-border bg-surface/20">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div className="space-y-4 lg:sticky lg:top-24">
          <span className="mono-label text-[10px] text-primary">01 / Capabilities</span>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Digital systems engineered as infrastructure.
          </h2>
          <p className="max-w-xl text-sm leading-7 text-muted-foreground">
            Every engagement is framed as a production system: architecture, performance, operations, and delivery are designed to work together from day one.
          </p>
          <Link href="/services" className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.24em] text-primary transition-colors hover:text-foreground">
            View Full Matrix <ArrowUpRight className="size-3.5" />
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {services.map((service, i) => {
            const Icon = SERVICE_ICONS[i % SERVICE_ICONS.length];
            const desc = service.shortDescription || service.description || "Bespoke system architecture tailored to product requirements.";
            const num = (i + 1).toString().padStart(2, "0");

            return (
              <motion.div
                key={service.slug || `${service.title}-${i}`}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="panel-shell flex h-full flex-col justify-between p-5"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-muted-foreground">{num}</span>
                    <div className="rounded-full border border-border bg-surface-secondary p-2 text-primary">
                      <Icon className="size-3.5" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-base font-semibold tracking-tight text-foreground">{service.title}</h3>
                    <p className="text-sm leading-6 text-muted-foreground">{desc}</p>
                  </div>
                </div>
                <Link href={`/services/${service.slug || ""}`} className="mt-6 inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.24em] text-primary transition-colors hover:text-foreground">
                  Explore <ArrowUpRight className="size-3.5" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}