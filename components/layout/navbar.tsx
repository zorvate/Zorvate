"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { User } from "@supabase/supabase-js";

import { marketingNavigation } from "@/config/navigation";
import { createClient } from "@/lib/auth/supabase-auth";
import { logout } from "@/lib/auth/logout";
import { Magnetic } from "@/components/ui/magnetic";
import { getSiteSettings } from "@/lib/supabase/cms";

export function Navbar() {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    // Supabase auth subscription
    const supabase = createClient();
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    async function loadSettings() {
      const s = await getSiteSettings(supabase);
      setSettings(s);
    }
    loadSettings();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      listener.subscription.unsubscribe();
    };
  }, []);

  const isHome = pathname === "/";
  const headerVariants = {
    initial: isHome && !shouldReduceMotion ? { y: -72, opacity: 0 } : { y: 0, opacity: 1 },
    animate: { y: 0, opacity: 1 },
  };
  const headerTransition = isHome && !shouldReduceMotion
    ? { delay: 2.0, duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
    : { duration: 0.3 };

  return (
    <motion.header
      variants={headerVariants}
      initial="initial"
      animate="animate"
      transition={headerTransition}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b select-none ${
        scrolled
          ? "bg-background/80 backdrop-blur-md border-border/60 shadow-lg py-3"
          : "bg-transparent border-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Animated Brand Logo */}
        <Link href="/" className="font-black text-xl tracking-tighter text-foreground flex items-center gap-1.5 hover:opacity-90 transition-opacity select-none">
          <span className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-black text-sm tracking-tighter shadow-md shadow-primary/25">
            {(settings.company_name || "Zorvate").charAt(0)}
          </span>
          <span>{settings.company_name || "Zorvate"}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8 items-center">
          {marketingNavigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-xs font-bold uppercase tracking-wider relative py-1.5 transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.title}
                {isActive && (
                  <motion.span
                    layoutId="activeNavTrack"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="hidden md:block text-[10px] font-bold text-muted-foreground bg-muted px-3 py-1 rounded-full max-w-[160px] truncate border border-border/80">
                {user.email}
              </span>
              <button
                onClick={() => logout()}
                className="text-xs font-bold text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors">
                Login
              </Link>
              <Magnetic>
                <Link
                  href="/auth/register"
                  className="inline-flex h-9 items-center justify-center rounded-xl bg-primary px-4 text-xs font-bold text-primary-foreground shadow-md shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all"
                >
                  Get Started
                </Link>
              </Magnetic>
            </>
          )}

          {/* Mobile Drawer toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-xl transition-all cursor-pointer border border-transparent hover:border-border"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t bg-background/95 backdrop-blur-md overflow-hidden border-border/60"
          >
            <div className="px-6 py-6 space-y-4 font-semibold text-sm">
              {marketingNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block transition-all py-1.5 ${
                    pathname === item.href ? "text-primary pl-2 border-l-2 border-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
