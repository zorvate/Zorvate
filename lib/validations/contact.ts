import { z } from "zod";

export const contactRequestSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address format"),
  company: z.string().max(100).optional().nullable(),
  project_type: z.string().max(100).optional().nullable(),
  budget: z.string().max(100).optional().nullable(),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
  file_path: z.string().optional().nullable(),
  status: z.enum(["new", "contacted", "qualified", "archived"]).default("new"),
  priority: z.enum(["low", "medium", "high", "critical"]).default("medium"),
});

export type ContactRequestInputType = z.infer<typeof contactRequestSchema>;
