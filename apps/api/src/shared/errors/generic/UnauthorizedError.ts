import { ApiErrorCode } from "~/shared/enums/apiCode.enum";

import { AppError } from "../base/AppError";

export class UnauthorizedError extends AppError {
	constructor(message = "Unauthorized") {
		super(message, ApiErrorCode.UNAUTHORIZED);
	}
}
