import { z } from "zod";

const trimmedString = z.string().trim();
const nonEmptyString = trimmedString.min(1);
const optionalTextField = (maxLength: number) => trimmedString.max(maxLength).optional().nullable();
const optionalUrlField = (message: string) =>
  z.union([trimmedString.url(message), z.literal("")]).optional().nullable();

export const faqSchema = z.object({
  id: z.string().uuid().optional(),
  question: nonEmptyString.min(5, "Question must be at least 5 characters").max(200),
  answer: nonEmptyString.min(10, "Answer must be at least 10 characters").max(1000),
  display_order: z.number().int().default(0),
});

export type FaqInputType = z.infer<typeof faqSchema>;

export const testimonialSchema = z.object({
  id: z.string().uuid().optional(),
  name: nonEmptyString.min(2, "Name must be at least 2 characters").max(100),
  role: nonEmptyString.min(2, "Role/Title must be at least 2 characters").max(100),
  text: nonEmptyString.min(10, "Quote text must be at least 10 characters").max(1000),
  rating: z.number().int().min(1).max(5).default(5),
  display_order: z.number().int().default(0),
});

export type TestimonialInputType = z.infer<typeof testimonialSchema>;

export const teamMemberSchema = z.object({
  id: z.string().uuid().optional(),
  name: nonEmptyString.min(2, "Name must be at least 2 characters").max(100),
  role: nonEmptyString.min(2, "Role must be at least 2 characters").max(100),
  image_url: optionalUrlField("Invalid image URL format").or(nonEmptyString),
  display_order: z.number().int().default(0),
});

export type TeamMemberInputType = z.infer<typeof teamMemberSchema>;

export const serviceSchema = z.object({
  id: z.string().uuid().optional(),
  slug: nonEmptyString.min(2, "Slug must be at least 2 characters").regex(/^[a-z0-9-]+$/, "Slug must be lowercase and contain only letters, numbers, and hyphens"),
  title: nonEmptyString.min(3, "Title must be at least 3 characters").max(100),
  short_description: nonEmptyString.min(10, "Short description must be at least 10 characters").max(200),
  description: nonEmptyString.min(20, "Detailed description must be at least 20 characters").max(2000),
  features: z.array(nonEmptyString).default([]),
  display_order: z.number().int().default(0),
});

export type ServiceInputType = z.infer<typeof serviceSchema>;

export const portfolioProjectSchema = z.object({
  id: z.string().uuid().optional(),
  slug: nonEmptyString.min(2, "Slug must be at least 2 characters").regex(/^[a-z0-9-]+$/, "Slug must be lowercase and contain only letters, numbers, and hyphens"),
  title: nonEmptyString.min(3, "Title must be at least 3 characters").max(100),
  description: nonEmptyString.min(10, "Description must be at least 10 characters").max(500),
  content: optionalTextField(5000),
  category: nonEmptyString.min(2, "Category must be at least 2 characters").max(50),
  image_url: optionalUrlField("Invalid image URL format"),
  gallery_urls: z.array(nonEmptyString).default([]),
  video_url: optionalUrlField("Invalid video URL"),
  live_url: optionalUrlField("Invalid live URL format"),
  technologies: z.array(nonEmptyString).default([]),
  featured: z.boolean().default(false),
  status: z.enum(["draft", "published"]).default("draft"),
  seo_title: optionalTextField(100),
  seo_description: optionalTextField(200),
  client_name: optionalTextField(100),
  project_date: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid project date format (YYYY-MM-DD)").optional().nullable(),
  challenge: optionalTextField(2000),
  solution: optionalTextField(2000),
  testimonial_quote: optionalTextField(1000),
  testimonial_author: optionalTextField(100),
  testimonial_role: optionalTextField(100),
  metrics: z.array(
    z.object({
      label: nonEmptyString,
      value: z.number(),
      suffix: nonEmptyString,
    })
  ).default([]),
  process_steps: z.array(
    z.object({
      phase: nonEmptyString,
      title: nonEmptyString,
      desc: nonEmptyString,
    })
  ).default([]),
});

export type PortfolioProjectInputType = z.infer<typeof portfolioProjectSchema>;

export const jobSchema = z.object({
  id: z.string().uuid().optional(),
  title: nonEmptyString.min(3, "Job title must be at least 3 characters").max(200),
  department: nonEmptyString.min(2, "Department is required").max(100),
  location: nonEmptyString.min(2, "Location is required").max(100),
  type: nonEmptyString.min(2, "Job type is required").max(100),
  salary: nonEmptyString.min(2, "Salary range is required").max(100),
  description: nonEmptyString.min(10, "Description must be at least 10 characters").max(1000),
  requirements: z.array(nonEmptyString).default([]),
  benefits: z.array(nonEmptyString).default([]),
  status: z.enum(["open", "closed"]).default("open"),
});

export type JobInputType = z.infer<typeof jobSchema>;

export const jobApplicationSchema = z.object({
  job_id: z.string().uuid("Invalid job selection"),
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  resume_path: z.string().url("Invalid resume URL").min(1, "Resume URL is required"),
  cover_letter: optionalTextField(1000),
});

export type JobApplicationInputType = z.infer<typeof jobApplicationSchema>;
