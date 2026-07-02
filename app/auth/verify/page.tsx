"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MailOpen, ArrowLeft } from "lucide-react";

export default function VerifyPage() {
  return (
    <div className="flex min-h-screen bg-background relative overflow-hidden">
      {/* LEFT SIDE: Brand Illustration (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-neutral-950 relative overflow-hidden items-center justify-center border-r border-border/10 select-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        
        {/* Orbit Background Spheres */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-primary/10 blur-[90px] animate-pulse pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent/5 blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center max-w-md text-center p-8">
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 45, ease: "linear" }}
            className="w-56 h-56 rounded-full border border-white/5 relative flex items-center justify-center mb-10"
          >
            <div className="w-40 h-40 rounded-full border border-white/10 relative flex items-center justify-center">
              <div className="w-24 h-24 rounded-full border border-primary/20 relative flex items-center justify-center bg-black/60 shadow-2xl">
                <span className="text-primary font-black text-2xl tracking-tighter">Z</span>
              </div>
              <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary shadow-lg shadow-primary/50" />
            </div>
            <span className="absolute bottom-6 right-6 w-2.5 h-2.5 rounded-full bg-accent shadow-lg shadow-accent/50" />
          </motion.div>

          <h2 className="text-3xl font-black text-white tracking-tight leading-tight">
            Verification Sprints
          </h2>
          <p className="text-sm text-neutral-400 mt-4 leading-relaxed font-medium">
            Verifying your email coordinates helps us keep communications secure and maintains valid billing pipelines.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: Validation Confirmation Info */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 sm:px-12 relative overflow-y-auto">
        {/* Floating gradient mesh spheres */}
        <div className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-primary/5 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full bg-accent/5 blur-[95px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md relative z-10 py-12 text-center lg:text-left"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8 mx-auto lg:mx-0 shadow-inner">
            <MailOpen size={28} />
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">Verify Your Email</h1>
          <p className="text-muted-foreground text-sm mt-3 font-medium leading-relaxed">
            We dispatched a validation link directly to your inbox.
          </p>

          <p className="text-xs text-muted-foreground leading-relaxed mt-6">
            Please click the link inside the confirmation email to validate your account. Once verified, you can sign in to request digital project builds.
          </p>

          <div className="mt-10 pt-6 border-t">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 rounded-xl border hover:bg-muted px-6 py-3 text-sm font-bold transition-all"
            >
              <ArrowLeft size={14} /> Return to Login
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
