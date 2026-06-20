import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  PORT: z.coerce.number().int().positive(),
  DATABASE_URL: z.string(),
  COOKIE_SECRET: z.string(),
  EMAIL_HOST: z.string(),
  EMAIL_AUTH_USER: z.string(),
  EMAIL_AUTH_PASS: z.string(),
  DO_SPACES_ACCESS_KEY_ID: z.string(),
  DO_SPACES_SECRET_KEY: z.string(),
  DO_SPACES_ORIGIN_ENDPOINT: z.string(),
  DO_SPACES_CDN_URL: z.string(),
  DO_SPACES_DEFAULT_BUCKET_NAME: z.string(),
  DO_SPACES_REGION: z.string(),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "❌ Invalid environment variables:",
    JSON.stringify(parsed.error, null, 4),
  );
  process.exit(1);
}

export const env = parsed.data;
