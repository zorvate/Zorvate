"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
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
    <SectionWrapper className="border-t bg-background relative overflow-hidden">
      <div className="mx-auto max-w-6xl relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full"
            >
              Featured Case Studies
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight text-foreground"
            >
              Selected Digital Products
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-muted-foreground max-w-xl text-base leading-relaxed"
            >
              Take a look at some of the web applications, marketing platforms, and business systems we have delivered.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:gap-3 transition-all duration-300 bg-primary/5 hover:bg-primary/10 px-5 py-2.5 rounded-xl border border-primary/10"
            >
              View Full Gallery <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((project, idx) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
            >
              <PortfolioCard project={project} />
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
