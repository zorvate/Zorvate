import { z } from "zod";

export const projectSchema = z.object({
  client_id: z.string().uuid("Invalid client ID"),
  name: z.string().min(3, "Name must be at least 3 characters").max(100),
  description: z.string().max(500).optional(),
  status: z.enum(["planning", "active", "completed", "on_hold"]).default("planning"),
  progress: z.number().min(0).max(100).default(0),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid start date format (YYYY-MM-DD)").optional().nullable(),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid end date format (YYYY-MM-DD)").optional().nullable(),
});

export type ProjectInputType = z.infer<typeof projectSchema>;
