import { z } from "zod";

export const faqSchema = z.object({
  id: z.string().uuid().optional(),
  question: z.string().min(5, "Question must be at least 5 characters").max(200),
  answer: z.string().min(10, "Answer must be at least 10 characters").max(1000),
  display_order: z.number().int().default(0),
});

export type FaqInputType = z.infer<typeof faqSchema>;

export const testimonialSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  role: z.string().min(2, "Role/Title must be at least 2 characters").max(100),
  text: z.string().min(10, "Quote text must be at least 10 characters").max(1000),
  rating: z.number().int().min(1).max(5).default(5),
  display_order: z.number().int().default(0),
});

export type TestimonialInputType = z.infer<typeof testimonialSchema>;

export const teamMemberSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  role: z.string().min(2, "Role must be at least 2 characters").max(100),
  image_url: z.string().url("Invalid image URL format").or(z.string().min(1)),
  display_order: z.number().int().default(0),
});

export type TeamMemberInputType = z.infer<typeof teamMemberSchema>;

export const serviceSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(2, "Slug must be at least 2 characters").regex(/^[a-z0-9-]+$/, "Slug must be lowercase and contain only letters, numbers, and hyphens"),
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  short_description: z.string().min(10, "Short description must be at least 10 characters").max(200),
  description: z.string().min(20, "Detailed description must be at least 20 characters").max(2000),
  features: z.array(z.string()).default([]),
  display_order: z.number().int().default(0),
});

export type ServiceInputType = z.infer<typeof serviceSchema>;

export const portfolioProjectSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(2, "Slug must be at least 2 characters").regex(/^[a-z0-9-]+$/, "Slug must be lowercase and contain only letters, numbers, and hyphens"),
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  description: z.string().min(10, "Description must be at least 10 characters").max(500),
  content: z.string().optional().nullable(),
  category: z.string().min(2, "Category must be at least 2 characters").max(50),
  image_url: z.string().url("Invalid image URL format").or(z.string().min(1)).optional().nullable(),
  gallery_urls: z.array(z.string()).default([]),
  video_url: z.string().url("Invalid video URL").or(z.string().min(1)).optional().nullable(),
  live_url: z.string().url("Invalid live URL format").or(z.string().min(1)).optional().nullable(),
  technologies: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  status: z.enum(["draft", "published"]).default("draft"),
  seo_title: z.string().max(100).optional().nullable(),
  seo_description: z.string().max(200).optional().nullable(),
  client_name: z.string().max(100).optional().nullable(),
  project_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid project date format (YYYY-MM-DD)").optional().nullable(),
  challenge: z.string().optional().nullable(),
  solution: z.string().optional().nullable(),
  testimonial_quote: z.string().optional().nullable(),
  testimonial_author: z.string().optional().nullable(),
  testimonial_role: z.string().optional().nullable(),
  metrics: z.array(
    z.object({
      label: z.string(),
      value: z.number(),
      suffix: z.string(),
    })
  ).default([]),
  process_steps: z.array(
    z.object({
      phase: z.string(),
      title: z.string(),
      desc: z.string(),
    })
  ).default([]),
});

export type PortfolioProjectInputType = z.infer<typeof portfolioProjectSchema>;
