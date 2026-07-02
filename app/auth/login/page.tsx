"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, LayoutDashboard, ChevronRight, Activity, Terminal } from "lucide-react";

import { createClient } from "@/lib/auth/supabase-auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Nebulore from "@/components/forgeui/nebulore";
import { GlassCard } from "@/components/ui/glass-card";
import { SpotlightGlow } from "@/components/ui/spotlight-glow";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    setErrorMsg(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (!error) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        const role = profile?.role || "client";
        const normalizedRole = role.toLowerCase().replace(/_/g, "-");
        if (normalizedRole === "admin" || normalizedRole === "super-admin") {
          router.push("/admin");
        } else {
          router.push("/portal");
        }
      } else {
        router.push("/portal");
      }
      router.refresh();
    } else {
      setErrorMsg(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background relative overflow-hidden text-foreground">
      {/* LEFT PANEL: Cinematic Nebulore Canvas Backdrop (Desktop Only) */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden items-center justify-center border-r border-border/40 select-none">
        {/* Nebulore Shader Layer */}
        <div className="absolute inset-0 z-0">
          <Nebulore
            colors={["#1e1b4b", "#6d28d9", "#2563eb"]}
            speed={0.4}
            grain={0.3}
            height="100%"
          />
        </div>

        {/* Diagonal Screen Split overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-neutral-950 via-transparent to-transparent opacity-85 z-10" />
        
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_80%,transparent_100%)] pointer-events-none z-10" />

        {/* Floating Mock Glass Dashboard */}
        <div className="relative z-20 flex flex-col items-center max-w-lg p-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            {/* Interactive floating mock dashboard card */}
            <GlassCard
              tilt={true}
              tiltMaxAngle={4}
              glowColor="accent"
              className="p-6 border bg-card/20 backdrop-blur-2xl space-y-6 shadow-2xl relative"
            >
              <div className="flex justify-between items-center pb-4 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Zorvate Workspace</span>
                </div>
                <div className="p-1 rounded bg-white/5 border border-white/10 text-primary">
                  <LayoutDashboard size={13} />
                </div>
              </div>

              {/* Status statistics inside loader mockup */}
              <div className="space-y-4">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground font-semibold">Workspace Setup Progress</span>
                  <span className="text-primary font-bold">100%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.8, delay: 0.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-3.5 border border-white/5 bg-white/5 rounded-xl text-center">
                    <p className="text-[8px] uppercase tracking-wider text-muted-foreground font-bold">Client Satisfaction</p>
                    <p className="text-base font-black text-foreground mt-1">99.9%</p>
                  </div>
                  <div className="p-3.5 border border-white/5 bg-white/5 rounded-xl text-center">
                    <p className="text-[8px] uppercase tracking-wider text-muted-foreground font-bold">Projects Completed</p>
                    <p className="text-base font-black text-emerald-500 mt-1 flex items-center justify-center gap-1">
                      <Activity size={12} className="animate-pulse" /> 120+
                    </p>
                  </div>
                </div>
              </div>

              {/* Fake terminal log output */}
              <div className="p-4 border border-white/5 bg-black/40 rounded-xl font-mono text-[9px] text-muted-foreground space-y-1.5 overflow-hidden">
                <div className="flex items-center gap-1.5 text-primary">
                  <Terminal size={10} />
                  <span>zorvate client portal ready</span>
                </div>
                <p>&gt; securing connection ... [OK]</p>
                <p>&gt; loading dashboard workspace ... [READY]</p>
              </div>
            </GlassCard>
          </motion.div>

          {/* Core statement */}
          <div className="mt-12 text-center text-white/80">
            <h2 className="text-2xl font-black tracking-tight">Zorvate Client Portal</h2>
            <p className="text-xs text-neutral-400 mt-2 max-w-sm font-medium leading-relaxed">
              Log in to access your digital workspace dashboard, launch support requests, and review project roadmaps.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Auth Card Form */}
      <SpotlightGlow
        radius={600}
        glowColor="rgba(109, 40, 217, 0.06)"
        className="w-full lg:w-[45%] flex flex-col justify-center items-center px-6 sm:px-12 md:px-20 relative"
      >
        {/* Mobile backdrop glow */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-primary/5 blur-[100px] pointer-events-none lg:hidden" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/5 blur-[100px] pointer-events-none lg:hidden" />

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md relative z-10 py-12"
        >
          {/* Brand header */}
          <div className="mb-10 text-center lg:text-left">
            <Link href="/" className="inline-flex items-center gap-1.5 font-black text-xl tracking-tighter mb-6">
              <span className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-black text-sm tracking-tighter">Z</span>
              <span>Zorvate</span>
            </Link>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Welcome Back</h1>
            <p className="text-muted-foreground text-xs sm:text-sm mt-2 font-medium">
              Log in to sync with your client workspace dashboard.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 text-xs bg-destructive/10 text-destructive rounded-xl border border-destructive/20 font-medium mb-6 animate-pulse">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                className="mt-1 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive mt-1 font-medium">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors font-semibold"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative mt-1">
                <Input
                  id="password"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  className="pr-10 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive mt-1 font-medium">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full mt-4 h-11 text-sm font-bold shadow-lg shadow-primary/10 hover:brightness-110 hover:shadow-primary/30 transition-all duration-300 flex items-center justify-center gap-1.5"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"} <ChevronRight size={15} />
            </Button>
          </form>

          <div className="text-center text-xs text-muted-foreground mt-8 select-none">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="font-bold text-primary hover:underline transition-all">
              Create one now
            </Link>
          </div>
        </motion.div>
      </SpotlightGlow>
    </div>
  );
}