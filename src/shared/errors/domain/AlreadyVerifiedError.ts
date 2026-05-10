import { ApiErrorCode } from "~/shared/enums/apiCode.enum";

import { AppError } from "../base/AppError";

export class AlreadyVerifiedError extends AppError {
	constructor() {
		super("User already verified", ApiErrorCode.USER_ALREADY_VERIFIED);
	}
}
