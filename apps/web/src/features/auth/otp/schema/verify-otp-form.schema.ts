import { z } from "zod";

export const verifyOtpSchema = z.object({
  otp: z.string().length(6).default(""),
});

export const verifyOtpDefaults = verifyOtpSchema.parse({});

export type VerifyOtpValues = z.infer<typeof verifyOtpSchema>;
