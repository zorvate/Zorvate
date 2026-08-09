"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const footerLinks = [
  { title: "Systems", href: "#systems" },
  { title: "Work", href: "#work" },
  { title: "Process", href: "#process" },
  { title: "About", href: "/about" },
  { title: "Contact", href: "/contact" },
];

const socialLinks = [
  { title: "Instagram", href: "https://instagram.com" },
  { title: "LinkedIn", href: "https://linkedin.com" },
  { title: "GitHub", href: "https://github.com" },
];

export function Footer() {
  return (
    <footer className="bg-[#F5F4F0] border-t border-[#E0DDD6] py-16 px-6 lg:px-12 selection:bg-[#FF4D00]/20">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-12 pb-16 border-b border-[#E0DDD6]">
          {/* Brand */}
          <div className="lg:col-span-5 space-y-3">
            <Link
              href="/"
              className="text-lg font-mono uppercase tracking-[0.24em] font-semibold text-[#121316] hover:text-[#FF4D00] transition-colors inline-flex items-center gap-2"
            >
              <span className="signal-dot" />
              ZORVATE
            </Link>
            <p className="text-xs font-mono uppercase tracking-[0.14em] text-[#5C5D61]">
              Digital Engineering Studio
            </p>
            <p className="text-sm text-[#5C5D61] leading-relaxed max-w-sm pt-2">
              We build websites, software, AI and automation around the way your business actually works.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-4 space-y-4">
            <div className="text-xs font-mono uppercase tracking-[0.18em] text-[#84858A]">
              Navigation
            </div>
            <ul className="space-y-2.5">
              {footerLinks.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-[#121316] hover:text-[#FF4D00] transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.title}
                    <ArrowUpRight className="size-3 text-[#FF4D00] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div className="lg:col-span-3 space-y-4">
            <div className="text-xs font-mono uppercase tracking-[0.18em] text-[#84858A]">
              Network
            </div>
            <ul className="space-y-2.5">
              {socialLinks.map((link) => (
                <li key={link.title}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-[#121316] hover:text-[#FF4D00] transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.title}
                    <ArrowUpRight className="size-3 text-[#5C5D61] group-hover:text-[#FF4D00] transition-colors" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Legal / Location Meta */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono text-[#84858A] uppercase tracking-[0.12em]">
          <div>
            Pakistan / Worldwide — © {new Date().getFullYear()} Zorvate. All rights reserved.
          </div>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-[#121316] transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-[#121316] transition-colors">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}