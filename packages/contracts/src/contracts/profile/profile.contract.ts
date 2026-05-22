import z from "zod";

import { DateStringSchema } from "../../lib/schema/date.schema";

export const ProfileSchema = z.object({
  name: z.string().min(2),
  bio: z.string().nullable(),
  dob: DateStringSchema.nullable(),
  profilePictureUrl: z.url().nullable(),
});

export type Profile = z.infer<typeof ProfileSchema>;
