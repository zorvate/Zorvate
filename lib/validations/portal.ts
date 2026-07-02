import { z } from "zod";

export const portalMessageSchema = z.object({
  projectId: z.string().uuid("Invalid project ID"),
  content: z.string().min(1, "Message content cannot be empty").max(1000),
});

export const portalFileUploadSchema = z.object({
  projectId: z.string().uuid("Invalid project ID"),
  name: z.string().min(1).max(255),
  filePath: z.string().min(1),
  fileSize: z.number().int().positive(),
  fileType: z.string().min(1),
});

export const portalMeetingSchema = z.object({
  meetingType: z.enum([
    "discovery",
    "sprint_sync",
    "design_review",
    "architecture_review",
  ]),
  dateTime: z.string().min(1, "Please select a date and time"),
  description: z.string().max(1000).optional().nullable(),
});

export const portalProfileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100),
  avatarUrl: z.string().url("Invalid image URL format").or(z.literal("")).optional().nullable(),
});
