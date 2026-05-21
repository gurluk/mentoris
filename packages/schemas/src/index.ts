import { z } from "zod";

export type TestType = string;

export const lele = z.object({
  email: z.string(),
});
