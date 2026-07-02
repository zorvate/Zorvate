import { z } from "zod";
import { nodeEnvSchema } from "./shared";

const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NODE_ENV: nodeEnvSchema,
});

const parsed = clientEnvSchema.safeParse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NODE_ENV:
  process.env.NODE_ENV === "development" ||
  process.env.NODE_ENV === "production" ||
  process.env.NODE_ENV === "test"
    ? process.env.NODE_ENV
    : "development",
});

if (!parsed.success) {
  console.warn("⚠️ Invalid client environment variables:", parsed.error.format());
}

export const env = parsed.success
  ? parsed.data
  : {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-url.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key",
      NODE_ENV: (process.env.NODE_ENV ?? "development") as
  | "development"
  | "production"
  | "test",
    };
