import { z } from "zod";

import { DateStringSchema } from "~/shared/schemas/datetime.schema";

export const UpdateProfileRequestSchema = z
  .object({
    name: z.string().optional(),
    bio: z.string().optional(),
    dob: DateStringSchema.optional(),
    profilePicture: z.url().optional(),
  })
  .strict();

export type UpdateProfileRequest = z.infer<typeof UpdateProfileRequestSchema>;
