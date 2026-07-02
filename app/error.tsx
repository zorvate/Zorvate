"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Home, AlertOctagon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Runtime error caught:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 text-center relative overflow-hidden select-none">
      {/* Decorative background gradients */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-primary/5 blur-[90px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent/5 blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full p-8 border rounded-3xl bg-card/45 backdrop-blur-md glass-panel space-y-6 relative z-10 shadow-sm"
      >
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mx-auto">
          <AlertOctagon size={28} className="animate-bounce" />
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
            System Collision
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-2 font-medium">
            An unexpected render crash occurred during compilation. Our development operations team has been notified.
          </p>
        </div>

        <div className="flex gap-3 justify-center pt-2">
          <Button
            onClick={() => reset()}
            className="flex items-center gap-1.5 rounded-xl h-11 text-xs font-bold"
          >
            <RefreshCw size={13} /> Try Again
          </Button>
          <Button
            onClick={() => (window.location.href = "/")}
            variant="outline"
            className="flex items-center gap-1.5 rounded-xl h-11 text-xs font-bold border"
          >
            <Home size={13} /> Return Home
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
