import { SwaggerTags } from "~/shared/constants/swaggerTags";
import { HttpStatus } from "~/shared/enums/httpStatus.enum";
import { ApiResponseSchema } from "~/shared/schemas/responseSuccess.schema";
import { createRouteSchema } from "~/shared/utils/createRouteSchema.util";

import { ProfileDtoSchema } from "../dto/profile.dto";
import { UpdateProfileRequestSchema } from "../dto/update-profile.schema";

const TAG = SwaggerTags.PROFILE;

export const updateProfileRouteSchema = createRouteSchema({
	tags: [TAG],
	summary: "Updates profile",
	body: UpdateProfileRequestSchema,
	response: {
		[HttpStatus.OK]: ApiResponseSchema(ProfileDtoSchema),
	},
});

export const getProfileRouteSchema = createRouteSchema({
	tags: [TAG],
	summary: "Fetches profile data",
	response: {
		[HttpStatus.OK]: ApiResponseSchema(ProfileDtoSchema),
	},
});
