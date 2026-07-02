"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Compass, RefreshCw } from "lucide-react";

import { ParticlesBackdrop } from "@/components/ui/particles-backdrop";
import { GlassCard } from "@/components/ui/glass-card";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 text-center relative overflow-hidden select-none text-foreground">
      {/* Dynamic drifting background particles */}
      <ParticlesBackdrop quantity={50} />
      
      {/* Decorative radial glows */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <GlassCard
          tilt={true}
          tiltMaxAngle={6}
          glowColor="accent"
          className="p-8 border bg-card/25 shadow-2xl relative"
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto border border-primary/20 shadow-inner">
            <Compass size={28} className="animate-spin-slow" />
          </div>

          <div className="mt-8 space-y-3">
            <h1 className="text-7xl font-black tracking-tighter bg-gradient-to-b from-white/10 to-transparent bg-clip-text text-transparent select-none">
              404
            </h1>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
              Coordinates Lost
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium">
              The page sprint you requested could not be located on the Zorvate server network.
            </p>
          </div>

          <div className="pt-8 border-t border-border/40 mt-8 flex flex-col gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 h-11 text-xs font-bold text-primary-foreground hover:brightness-110 active:scale-[0.98] transition-all shadow-md shadow-primary/20"
            >
              <ArrowLeft size={14} /> Back to Home
            </Link>
            
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border/80 bg-background/50 hover:bg-muted px-6 h-11 text-xs font-bold transition-all text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <RefreshCw size={12} /> Sync Server Connection
            </button>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
