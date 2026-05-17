import { z } from "zod";

export const schema = z.object({
  email: z.string().min(1, "Adresa e-pošte je obavezno polje").default(""),
  password: z.string().min(1, "Lozinka je obavezno polje").default(""),
});

export const defaultValues = schema.parse({});

export type LoginForm = z.infer<typeof schema>;
