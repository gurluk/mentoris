import z from "zod";

import { DateStringSchema } from "~/shared/schemas/datetime.schema";

export const ProfileDtoSchema = z.object({
	name: z.string().min(2),
	bio: z.string().nullable(),
	dob: DateStringSchema.nullable(),
	profilePictureUrl: z.url().nullable(),
});

export type ProfileDto = z.infer<typeof ProfileDtoSchema>;
