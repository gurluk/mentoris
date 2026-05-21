import { ApiErrorCode } from "~/shared/enums/apiCode.enum";

import { AppError } from "../base/AppError";

export class ValidationError extends AppError {
	constructor(message = "Validation failed") {
		super(message, ApiErrorCode.VALIDATION_ERROR);
	}
}
