import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Unesite ispravnu e-mail adresu").default(""),
});

export const loginDefaults = loginSchema.parse({});

export type LoginValues = z.infer<typeof loginSchema>;
