"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/browser";
import { getSiteSettings } from "@/lib/supabase/cms";

const quickLinks = [
  { title: "About Studio", href: "/about" },
  { title: "Digital Services", href: "/services" },
  { title: "Portfolio Archive", href: "/portfolio" },
  { title: "Contact Desk", href: "/contact" },
  { title: "Portal Dashboard", href: "/portal" },
];

export function Footer() {
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    const supabase = createClient();
    async function loadSettings() {
      const s = await getSiteSettings(supabase);
      setSettings(s);
    }
    loadSettings();
  }, []);

  const companyName = settings.company_name || "Zorvate";
  const companyEmail = settings.company_email || "hello@zorvate.com";
  const companyAddress = settings.company_address || "Remote Worldwide";
  const companyDesc = settings.company_description || "We engineer high-fidelity web systems, design systems, and digital dashboards for teams requiring elite engineering quality and performance optimization.";

  return (
    <footer className="border-t border-border/80 bg-background relative overflow-hidden select-none">
      {/* Background radial spotlight highlight */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 py-20 relative z-10">
        <div className="grid gap-12 md:grid-cols-4 pb-12 border-b border-border/40">
          
          {/* Brand Presentation */}
          <div className="space-y-4 md:col-span-2">
            <Link href="/" className="font-black text-xl tracking-tighter text-foreground flex items-center gap-1.5 hover:opacity-90 transition-opacity">
              <span className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-black text-sm tracking-tighter shadow-sm shadow-primary/20">
                {companyName.charAt(0)}
              </span>
              <span>{companyName}</span>
            </Link>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium max-w-sm">
              {companyDesc}
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Navigation Map</h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs sm:text-sm font-semibold text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Coordinates & Channels */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Inquiry Channel</h3>
            <div className="space-y-2.5 text-xs sm:text-sm font-semibold text-muted-foreground">
              <p className="hover:text-primary transition-colors cursor-pointer select-all">{companyEmail}</p>
              <p>{companyAddress}</p>
              <p>Mon – Fri Sprints</p>
            </div>
          </div>
        </div>

        {/* Footer bottom bar with massive brand watermark */}
        <div className="pt-12 flex flex-col sm:flex-row justify-between items-center gap-6 relative">
          <div className="text-xs font-medium text-muted-foreground">
            © {new Date().getFullYear()} {companyName} Studio. All rights reserved.
          </div>
          <div className="flex gap-6 text-xs font-medium text-muted-foreground">
            <Link href="/terms" className="hover:text-foreground hover:underline transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-foreground hover:underline transition-colors">Privacy Policy</Link>
          </div>

          {/* Massive Low-Opacity Branding Watermark */}
          <div className="absolute -bottom-14 left-0 right-0 text-center pointer-events-none select-none overflow-hidden h-24 hidden md:block">
            <span className="text-[120px] font-black tracking-tighter leading-none bg-gradient-to-b from-white/[0.03] to-transparent bg-clip-text text-transparent uppercase select-none">
              {companyName}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}