import z from "zod";

export const DictionarySchema = z.object({
  id: z.number(),
  code: z.string(),
  label: z.string(),
});

export type Dictionary = z.infer<typeof DictionarySchema>;
