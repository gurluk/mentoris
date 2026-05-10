import { FastifyReply } from "fastify";

import { ApiErrorCode } from "~/shared/enums/apiCode.enum";
import { HttpStatus } from "~/shared/enums/httpStatus.enum";
import { buildErrorResponse } from "~/shared/utils/errorResponse.util";

export function handleUnknownError(error: unknown, reply: FastifyReply) {
	console.log("🚀 ~ handleUnknownError ~ error:", error);
	return reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send(
		buildErrorResponse({
			message: "Something went wrong",
			code: ApiErrorCode.INTERNAL_SERVER_ERROR,
		}),
	);
}
