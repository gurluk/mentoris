import "server-only";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  EMAIL_HOST: z.string().min(1),
  EMAIL_AUTH_USER: z.string().min(1),
  EMAIL_AUTH_PASS: z.string().min(1),
  DO_SPACES_ACCESS_KEY_ID: z.string().min(1),
  DO_SPACES_SECRET_KEY: z.string().min(1),
  DO_SPACES_ORIGIN_ENDPOINT: z.string().min(1),
  DO_SPACES_CDN_URL: z.string().min(1),
  DO_SPACES_DEFAULT_BUCKET_NAME: z.string().min(1),
  DO_SPACES_REGION: z.string().min(1),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // In Next.js we don't kill the process; we throw during module evaluation
  console.error("❌ Invalid environment variables:");
  console.error(parsed.error.flatten().fieldErrors);

  throw new Error("Invalid environment variables");
}

export const env = parsed.data;
