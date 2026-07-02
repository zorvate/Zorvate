import { z } from "zod";

export const profileSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters").max(100).optional(),
  avatar_url: z.string().url("Invalid avatar URL format").optional().or(z.literal("")),
  role: z.enum(["admin", "super-admin", "manager", "developer", "designer", "client"]).optional(),
});

export type ProfileInputType = z.infer<typeof profileSchema>;
