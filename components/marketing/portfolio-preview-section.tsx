"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { PortfolioCard } from "./portfolio-card";
import { SectionWrapper } from "./section-wrapper";
import { createClient } from "@/lib/supabase/browser";
import { getPortfolioProjects } from "@/lib/supabase/cms";

interface PortfolioProjectItem {
  slug: string;
  title: string;
  category: string;
  description: string;
  image_url?: string | null;
  technologies?: string[] | null;
}

export function PortfolioPreviewSection() {
  const [featured, setFeatured] = useState<PortfolioProjectItem[]>([]);

  useEffect(() => {
    const supabase = createClient();
    void getPortfolioProjects(supabase)
      .then((data) => setFeatured(data.filter((project) => project.featured !== false).slice(0, 3)))
      .catch(() => setFeatured([]));
  }, []);

  return (
    <SectionWrapper className="border-b border-border bg-surface/20">
      <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
        <div className="space-y-4 lg:sticky lg:top-24">
          <span className="mono-label text-[10px] text-primary">04 / Portfolio Archive</span>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Selected systems, documented with precision.</h2>
          <p className="text-sm leading-7 text-muted-foreground">Each project is treated as an engineered outcome: clear architecture, measurable delivery, and a defined operational context.</p>
          <Link href="/portfolio" className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.24em] text-primary transition-colors hover:text-foreground">
            View Full Archive <ArrowUpRight className="size-3.5" />
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {featured.map((project, idx) => (
            <motion.div key={project.slug} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.06, duration: 0.35 }}>
              <PortfolioCard project={project} />
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
