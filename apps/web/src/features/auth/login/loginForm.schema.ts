import { z } from "zod";

export const schema = z.object({
  email: z.email("Unesite ispravnu e-mail adresu").default(""),
});

export const defaultValues = schema.parse({});

export type LoginForm = z.infer<typeof schema>;
