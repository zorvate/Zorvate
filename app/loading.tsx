"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#09090b] select-none text-foreground">
      {/* Decorative radial glows */}
      <div className="absolute top-1/3 left-1/3 w-80 h-80 rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/3 w-80 h-80 rounded-full bg-accent/5 blur-[100px] pointer-events-none" />
      
      <div className="flex flex-col items-center gap-6 relative z-10">
        {/* Orbital Ring Logo Animation */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          {/* Inner Logo Core */}
          <div className="w-12 h-12 rounded-xl border border-primary/20 bg-[#0d0d15] flex items-center justify-center shadow-lg shadow-primary/10 relative z-20">
            <span className="text-primary font-black text-xl tracking-tighter">Z</span>
          </div>

          {/* Outer Orbital Ring 1 */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
            className="absolute inset-0 rounded-full border border-dashed border-white/10 z-10"
          />

          {/* Outer Orbital Ring 2 with Accent Node */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 4.5, ease: "linear" }}
            className="absolute w-20 h-20 rounded-full border border-white/5 z-0 flex items-start justify-center"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent shadow-md shadow-accent/50 -mt-1" />
          </motion.div>
        </div>

        {/* Syncing status */}
        <div className="text-center space-y-1.5">
          <span className="text-[10px] font-black tracking-widest text-primary uppercase animate-pulse block">
            Synchronizing Zorvate
          </span>
          <span className="text-[9px] font-medium text-muted-foreground font-mono block">
            connecting workspace node ... [SECURE]
          </span>
        </div>
      </div>
    </div>
  );
}
