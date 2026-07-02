"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, ArrowRight } from "lucide-react";

import { submitContactInquiryAction } from "@/lib/backend/actions/contact-actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

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
        <GlassCard
          tilt={false}
          className="p-8 border bg-card/25 text-center space-y-6"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mx-auto shadow-inner">
            <CheckCircle2 size={32} className="animate-bounce" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Message Dispatched!</h3>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              We received your inquiry request. A Zorvate representative will review your scope specifications and reply shortly.
            </p>
          </div>
          <Button
            onClick={() => setSuccess(false)}
            variant="outline"
            className="rounded-xl border h-10 px-6 font-bold"
          >
            Send Another Message
          </Button>
        </GlassCard>
      ) : (
        <GlassCard
          tilt={false}
          className="p-6 sm:p-8 border bg-card/25"
        >
          {errorMsg && (
            <div className="p-3 text-xs bg-destructive/10 text-destructive rounded-xl border border-destructive/20 font-medium mb-6">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Your Name"
                  type="text"
                  className="mt-1 focus:ring-primary/20 focus:border-primary transition-all"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-xs text-destructive mt-1 font-medium">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  placeholder="you@example.com"
                  type="email"
                  className="mt-1 focus:ring-primary/20 focus:border-primary transition-all"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-destructive mt-1 font-medium">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Project Scope Query"
                type="text"
                className="mt-1 focus:ring-primary/20 focus:border-primary transition-all"
                {...register("subject")}
              />
              {errors.subject && (
                <p className="text-xs text-destructive mt-1 font-medium">{errors.subject.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="message">Message Specifications</Label>
              <Textarea
                id="message"
                placeholder="Describe your design and engineering roadmap goals..."
                rows={5}
                className="mt-1 focus:ring-primary/20 focus:border-primary transition-all"
                {...register("message")}
              />
              {errors.message && (
                <p className="text-xs text-destructive mt-1 font-medium">{errors.message.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-4 h-11 text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/10 transition-all duration-300"
            >
              {loading ? "Sending Message..." : "Send Inquiry"} <ArrowRight size={15} />
            </Button>
          </form>
        </GlassCard>
      )}
    </div>
  );
}
