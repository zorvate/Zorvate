"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, ArrowUpRight } from "lucide-react";

import { submitContactInquiryAction } from "@/lib/backend/actions/contact-actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (values: ContactFormValues) => {
    setLoading(true);
    setErrorMsg(null);

    const res = await submitContactInquiryAction({
      name: values.name,
      email: values.email,
      message: `Subject: ${values.subject}\n\n${values.message}`,
      status: "new",
      priority: "medium",
    });

    setLoading(false);
    if (res.success) {
      setSuccess(true);
      reset();
    } else {
      setErrorMsg(res.error);
    }
  };

  return (
    <div className="w-full">
      {success ? (
        <div className="p-8 border border-border bg-surface rounded-[var(--radius-card)] text-center space-y-4">
          <div className="size-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="size-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-foreground">Specification Received</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We received your inquiry. An engineer will review your project requirements and reply within 24 hours.
            </p>
          </div>
          <Button
            onClick={() => setSuccess(false)}
            variant="outline"
            size="sm"
          >
            Send Another Message
          </Button>
        </div>
      ) : (
        <div className="p-8 border border-border bg-surface rounded-[var(--radius-card)] space-y-6">
          {errorMsg && (
            <div className="p-3 text-xs bg-destructive/10 text-destructive rounded-[var(--radius-sm)] border border-destructive/20 font-mono">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="mono-label text-[10px]">FULL NAME</Label>
                <Input
                  id="name"
                  placeholder="e.g. Alex Mercer"
                  type="text"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-[10px] font-mono text-destructive mt-1">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="mono-label text-[10px]">EMAIL ADDRESS</Label>
                <Input
                  id="email"
                  placeholder="alex@company.com"
                  type="email"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-[10px] font-mono text-destructive mt-1">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="subject" className="mono-label text-[10px]">PROJECT SUBJECT</Label>
              <Input
                id="subject"
                placeholder="e.g. Next.js App Architecture & Sprints"
                type="text"
                {...register("subject")}
              />
              {errors.subject && (
                <p className="text-[10px] font-mono text-destructive mt-1">{errors.subject.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="message" className="mono-label text-[10px]">PROJECT SCOPE &amp; SPECIFICATIONS</Label>
              <Textarea
                id="message"
                placeholder="Detail target milestones, budget, scope, and technical requirements..."
                rows={5}
                {...register("message")}
              />
              {errors.message && (
                <p className="text-[10px] font-mono text-destructive mt-1">{errors.message.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              size="lg"
              className="w-full gap-2"
            >
              {loading ? "Transmitting..." : "Transmit Project Scope"} <ArrowUpRight className="size-4" />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
