import { FastifyError, FastifyReply } from "fastify";

import {
  buildErrorResponse,
  errorCodeToHttpStatus,
} from "~/shared/utils/errorResponse.util";

import { AppError } from "../base/AppError";

export function handleAppError(error: FastifyError, reply: FastifyReply) {
  if (!(error instanceof AppError)) return false;
  console.log("🚀 ~ handleAppError ~ error:", error);

  const errorResponse = buildErrorResponse(error);
  const status = errorCodeToHttpStatus[errorResponse.code];

  reply.status(status).send(errorResponse);

  return true;
}
