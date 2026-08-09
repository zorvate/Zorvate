"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MagneticButton } from "@/components/ui/magnetic-button";

const navItems = [
  { title: "Systems", href: "#systems" },
  { title: "Work", href: "#work" },
  { title: "Process", href: "#process" },
  { title: "About", href: "/about" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ${
        scrolled
          ? "bg-[#F5F4F0]/90 backdrop-blur-md border-b border-[#E0DDD6]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-12">
        {/* Brand Mark */}
        <Link
          href="/"
          className="text-sm font-mono uppercase tracking-[0.24em] font-semibold text-[#121316] hover:text-[#FF4D00] transition-colors flex items-center gap-2"
        >
          <span className="signal-dot" />
          ZORVATE
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isAnchor = item.href.startsWith("#");
            const href = isAnchor && pathname !== "/" ? `/${item.href}` : item.href;
            return (
              <Link
                key={item.title}
                href={href}
                className="text-xs font-mono uppercase tracking-[0.16em] text-[#5C5D61] hover:text-[#121316] transition-colors relative py-1 group"
              >
                {item.title}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#FF4D00] group-hover:w-full transition-all duration-200" />
              </Link>
            );
          })}
        </nav>

        {/* Header Action CTA */}
        <div className="hidden sm:flex items-center gap-4">
          <MagneticButton>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-mono uppercase tracking-[0.14em] font-medium border border-[#121316] text-[#121316] hover:bg-[#121316] hover:text-[#F5F4F0] transition-all duration-200 group"
            >
              Start a Project
              <ArrowUpRight className="size-3.5 text-[#FF4D00] group-hover:text-[#F5F4F0] transition-colors" />
            </Link>
          </MagneticButton>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          className="md:hidden text-[#121316] p-1.5 focus:outline-none"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-[#F5F4F0] border-b border-[#E0DDD6] px-6 py-6"
          >
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="text-xs font-mono uppercase tracking-[0.16em] text-[#121316] py-1 border-b border-[#E0DDD6]"
                >
                  {item.title}
                </Link>
              ))}
              <div className="pt-2">
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="inline-flex w-full items-center justify-center gap-2 py-2.5 text-xs font-mono uppercase tracking-[0.14em] font-medium border border-[#121316] text-[#121316] bg-transparent"
                >
                  Start a Project <ArrowUpRight className="size-3.5 text-[#FF4D00]" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

