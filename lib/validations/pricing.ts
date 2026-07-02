import { z } from "zod";

export const pricingPlanSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(2, "Slug must be at least 2 characters").regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric and hyphens"),
  name: z.string().min(2, "Plan name must be at least 2 characters").max(100),
  description: z.string().max(300).optional().nullable(),
  price: z.number().nonnegative("Price must be a positive number or zero"),
  currency: z.string().min(3).max(3).default("PKR"),
  billing_label: z.string().min(2).max(50).default("Starting From"),
  gradient: z.string().min(2).max(50).default("indigo"),
  badge: z.string().max(50).optional().nullable(),
  button_text: z.string().min(2).max(50).default("Get Started"),
  button_url: z.string().min(1).max(200).default("/contact"),
  is_popular: z.boolean().default(false),
  display_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
});

export type PricingPlanInput = z.infer<typeof pricingPlanSchema>;

export const pricingFeatureSchema = z.object({
  id: z.string().uuid().optional(),
  plan_id: z.string().uuid("Invalid plan ID format"),
  feature: z.string().min(2, "Feature description must be at least 2 characters").max(200),
  icon: z.string().min(1).max(50).default("Check"),
  enabled: z.boolean().default(true),
  display_order: z.number().int().default(0),
});

export type PricingFeatureInput = z.infer<typeof pricingFeatureSchema>;

export const pricingComparisonSchema = z.object({
  id: z.string().uuid().optional(),
  feature_name: z.string().min(2, "Feature name must be at least 2 characters").max(100),
  starter: z.string().min(1).max(50),
  business: z.string().min(1).max(50),
  web_app: z.string().min(1).max(50),
  ai: z.string().min(1).max(50),
  display_order: z.number().int().default(0),
});

export type PricingComparisonInput = z.infer<typeof pricingComparisonSchema>;
