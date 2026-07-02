"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Cpu, Palette, Layers, LayoutDashboard, Plug, Zap } from "lucide-react";
import { SectionWrapper } from "./section-wrapper";

const services = [
  {
    title: "SaaS Development",
    desc: "End-to-end SaaS platforms with authentication, dashboards, and scalable architecture.",
    icon: Cpu,
  },
  {
    title: "UI/UX Design",
    desc: "Modern, conversion-focused interfaces designed for engagement and retention.",
    icon: Palette,
  },
  {
    title: "Full-Stack Systems",
    desc: "Next.js + Supabase production systems built for real-world scale.",
    icon: Layers,
  },
  {
    title: "Admin Dashboards",
    desc: "Powerful internal tools for managing users, content, and business operations.",
    icon: LayoutDashboard,
  },
  {
    title: "API Integrations",
    desc: "Stripe, email, storage, analytics, and third-party system integrations.",
    icon: Plug,
  },
  {
    title: "Performance Optimization",
    desc: "Speed tuning, SEO improvements, and Core Web Vitals optimization.",
    icon: Zap,
  },
];

interface CardProps {
  title: string;
  desc: string;
  icon: React.ComponentType<{ size?: number }>;
  idx: number;
}

function ServiceCard({ title, desc, icon: Icon, idx }: CardProps) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -8 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="p-8 rounded-2xl border bg-card/40 hover:bg-card/75 backdrop-blur-md glass-panel relative overflow-hidden group transition-all duration-300 flex flex-col justify-between min-h-[240px] cursor-default"
    >
      {/* Mouse Tracking Spotlight Glow */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
        style={{
          background: `radial-gradient(200px circle at ${coords.x}px ${coords.y}px, rgba(139, 92, 246, 0.12), transparent 80%)`,
        }}
      />

      {/* Spotlight Border */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 border border-primary/30"
        style={{
          clipPath: isHovered
            ? `circle(130px at ${coords.x}px ${coords.y}px)`
            : "circle(0px)",
        }}
      />

      <div className="space-y-5 relative z-20">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
          <Icon size={22} />
        </div>
        <div>
          <h3 className="font-bold text-xl text-foreground tracking-tight group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
            {desc}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function ServicesSection() {
  return (
    <SectionWrapper id="services" className="border-t relative overflow-hidden py-24 md:py-32 bg-background">
      {/* Background aurora blur */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[130px] pointer-events-none" />

      <div className="text-center mb-16 relative z-10">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3.5 py-1 rounded-full border border-primary/10 select-none"
        >
          Our Capabilities
        </motion.span>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-5xl font-extrabold tracking-tight mt-4 text-foreground"
        >
          What We Build
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground mt-4 max-w-xl mx-auto text-base"
        >
          High-performance systems designed for scale, speed, and conversion.
        </motion.p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10 max-w-6xl mx-auto">
        {services.map((service, i) => (
          <ServiceCard
            key={i}
            title={service.title}
            desc={service.desc}
            icon={service.icon}
            idx={i}
          />
        ))}
      </div>
    </SectionWrapper>
  );
}