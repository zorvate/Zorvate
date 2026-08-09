"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, ArrowRight, ArrowLeft, Terminal, Activity, ShieldCheck } from "lucide-react";

import { createClient } from "@/lib/auth/supabase-auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Nebulore from "@/components/forgeui/nebulore";
import { GlassCard } from "@/components/ui/glass-card";
import { SpotlightGlow } from "@/components/ui/spotlight-glow";

const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1); // Onboarding Step (1 or 2)

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const passwordVal = watch("password") || "";

  // Password strength calculation
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: "Enter password", color: "bg-muted" };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 8) score += 1;
    if (/[0-9]/.test(pwd) || /[^A-Za-z0-9]/.test(pwd)) score += 1;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 1;

    const maps = [
      { score: 0, label: "Very Weak", color: "bg-red-500" },
      { score: 1, label: "Weak", color: "bg-orange-500" },
      { score: 2, label: "Medium", color: "bg-amber-500" },
      { score: 3, label: "Strong", color: "bg-indigo-500" },
      { score: 4, label: "Excellent", color: "bg-emerald-500" },
    ];
    return maps[score];
  };

  const strength = getPasswordStrength(passwordVal);

  const isAllowedEmail = (emailStr: string) => {
    const normalized = emailStr.toLowerCase().trim();
    const devAdmin = (process.env.NEXT_PUBLIC_DEV_ADMIN_EMAIL || "zorvate.space@gmail.com").toLowerCase().trim();
    return normalized.endsWith("@zorvate.com") || normalized === devAdmin || normalized === "zorvate.space@gmail.com";
  };

  const nextStep = async () => {
    setErrorMsg(null);
    // Validate Step 1 fields
    const valid = await trigger(["fullName", "email"]);
    if (valid) {
      const emailValue = watch("email") || "";
      if (!isAllowedEmail(emailValue)) {
        setErrorMsg("Registration restricted: Only authorized agency emails (@zorvate.com) or primary admin (zorvate.space@gmail.com) can register.");
        return;
      }
      setStep(2);
    }
  };

  const prevStep = () => {
    setStep(1);
  };

  const onSubmit = async (values: RegisterFormValues) => {
    setLoading(true);
    setErrorMsg(null);

    if (!isAllowedEmail(values.email)) {
      setErrorMsg("Registration restricted: Only authorized agency emails (@zorvate.com) or primary admin (zorvate.space@gmail.com) can register.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          full_name: values.fullName,
        },
      },
    });

    if (!error) {
      router.push("/auth/verify");
    } else {
      setErrorMsg(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background relative overflow-hidden text-foreground">
      {/* LEFT PANEL: Cinematic Nebulore Canvas (Desktop Only) */}
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
            <GlassCard
              tilt={true}
              tiltMaxAngle={4}
              glowColor="primary"
              className="p-6 border bg-card/20 backdrop-blur-2xl space-y-6 shadow-2xl relative"
            >
              <div className="flex justify-between items-center pb-4 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Zorvate Workspace</span>
                </div>
                <div className="p-1 rounded bg-white/5 border border-white/10 text-accent">
                  <ShieldCheck size={13} />
                </div>
              </div>

              {/* Step info mockups */}
              <div className="space-y-4">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground font-semibold">Security Credential Setup</span>
                  <span className="text-accent font-bold">100% Validated</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2.2, delay: 0.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-accent to-primary rounded-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-3.5 border border-white/5 bg-white/5 rounded-xl text-center">
                    <p className="text-[8px] uppercase tracking-wider text-muted-foreground font-bold">Secure Login</p>
                    <p className="text-xs font-black text-foreground mt-1">Active</p>
                  </div>
                  <div className="p-3.5 border border-white/5 bg-white/5 rounded-xl text-center">
                    <p className="text-[8px] uppercase tracking-wider text-muted-foreground font-bold">Project Setup</p>
                    <p className="text-xs font-black text-emerald-500 mt-1 flex items-center justify-center gap-1">
                      <Activity size={12} className="animate-pulse" /> 1-2 Minutes
                    </p>
                  </div>
                </div>
              </div>

              {/* Fake terminal log output */}
              <div className="p-4 border border-white/5 bg-black/40 rounded-xl font-mono text-[9px] text-muted-foreground space-y-1.5 overflow-hidden">
                <div className="flex items-center gap-1.5 text-accent">
                  <Terminal size={10} />
                  <span>zorvate client signup ready</span>
                </div>
                <p>&gt; initiating safe onboarding ... [OK]</p>
                <p>&gt; securing connection tunnel ... [OK]</p>
              </div>
            </GlassCard>
          </motion.div>

          <div className="mt-12 text-center text-white/80">
            <h2 className="text-2xl font-black tracking-tight">Create Zorvate Account</h2>
            <p className="text-xs text-neutral-400 mt-2 max-w-sm font-medium leading-relaxed font-sans">
              Register in seconds to initiate dashboard contracts, review milestones, and discuss project scopes.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Multi-step form card */}
      <SpotlightGlow
        radius={600}
        glowColor="rgba(168, 85, 247, 0.06)"
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
          {/* Progress indicators bar */}
          <div className="flex items-center gap-2 mb-8 select-none">
            <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${step === 1 ? "bg-primary/10 border-primary/20 text-primary" : "bg-muted/40 text-muted-foreground border-transparent"}`}>
              Step 1: Profile
            </span>
            <div className="w-6 h-[1px] bg-border" />
            <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${step === 2 ? "bg-primary/10 border-primary/20 text-primary" : "bg-muted/40 text-muted-foreground border-transparent"}`}>
              Step 2: Security
            </span>
          </div>

          {/* Form Header */}
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-1.5 font-black text-xl tracking-tighter mb-6">
              <span className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-black text-sm tracking-tighter">Z</span>
              <span>Zorvate</span>
            </Link>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Create Account</h1>
            <p className="text-muted-foreground text-xs sm:text-sm mt-2 font-medium">
              Join our portal to manage active development pipelines.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 text-xs bg-destructive/10 text-destructive rounded-xl border border-destructive/20 font-medium mb-6 animate-pulse">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="space-y-1.5">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      placeholder="John Doe"
                      type="text"
                      className="mt-1 focus:ring-primary/20 focus:border-primary transition-all"
                      {...register("fullName")}
                    />
                    {errors.fullName && (
                      <p className="text-xs text-destructive mt-1 font-medium">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      placeholder="name@example.com"
                      type="email"
                      className="mt-1 focus:ring-primary/20 focus:border-primary transition-all"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive mt-1 font-medium">{errors.email.message}</p>
                    )}
                  </div>

                  <Button
                    type="button"
                    onClick={nextStep}
                    className="w-full mt-6 h-11 text-sm font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-primary/10 transition-all duration-300"
                  >
                    Continue <ArrowRight size={15} />
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="space-y-1.5">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative mt-1">
                      <Input
                        id="password"
                        placeholder="••••••••"
                        type={showPassword ? "text" : "password"}
                        className="pr-10 focus:ring-primary/20 focus:border-primary transition-all"
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

                  {/* Password Strength Meter */}
                  <div className="space-y-2.5 mt-3 select-none">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-muted-foreground">Password strength:</span>
                      <span className="text-foreground">{strength.label}</span>
                    </div>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden flex gap-1">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-full flex-1 rounded-full transition-all duration-300 ${
                            i < (strength.score === 0 ? 0 : strength.score)
                              ? strength.color
                              : "bg-muted"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-6">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="border border-border/80 hover:bg-muted p-3 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground transition-all h-11 w-11"
                      title="Back to Step 1"
                    >
                      <ArrowLeft size={16} />
                    </button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1 h-11 text-sm font-bold shadow-lg shadow-primary/10 transition-all duration-300"
                    >
                      {loading ? "Creating account..." : "Register"}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          <div className="text-center text-xs text-muted-foreground mt-8 select-none">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-bold text-primary hover:underline transition-colors">
              Log in instead
            </Link>
          </div>
        </motion.div>
      </SpotlightGlow>
    </div>
  );
}