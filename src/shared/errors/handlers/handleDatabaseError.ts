import { DrizzleQueryError } from "drizzle-orm/errors";
import { FastifyError, FastifyReply } from "fastify";
import { DatabaseError } from "pg";

import { ApiErrorCode } from "~/shared/enums/apiCode.enum";
import { HttpStatus } from "~/shared/enums/httpStatus.enum";
import { buildErrorResponse } from "~/shared/utils/errorResponse.util";

export function handleDbError(error: FastifyError, reply: FastifyReply) {
	if (!(error instanceof DrizzleQueryError)) return false;

	const pgError = error.cause;

	if (!(pgError instanceof DatabaseError)) return false;
	// TODO just log the database error
	console.log("🚀 ~ handleDbError ~ dbError:", pgError);

	// const dbError = handleDatabaseError(pgError);

	// const response = buildErrorResponse({
	// 	message: dbError.message,
	// 	code: dbError.code,
	// });

	// Database errors return 500
	return reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send(
		buildErrorResponse({
			message: "Something went wrong",
			code: ApiErrorCode.INTERNAL_SERVER_ERROR,
		}),
	);

	return true;
}
