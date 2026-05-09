import { DatabaseError } from "pg";

import { ApiErrorCode } from "~/enums/apiCode.enum";
import { PostgresErrorCode } from "~/enums/postgresErrorCode.enum";

export function handleDatabaseError(error: DatabaseError): {
	message: string;
	code: ApiErrorCode;
} {
	switch (error.code) {
		case PostgresErrorCode.UNIQUE_VIOLATION:
			return {
				message: "Resource already exists",
				code: ApiErrorCode.CONFLICT,
			};

		case PostgresErrorCode.FOREIGN_KEY_VIOLATION:
		case PostgresErrorCode.NOT_NULL_VIOLATION:
			return {
				message: "Invalid request data",
				code: ApiErrorCode.BAD_REQUEST,
			};

		case PostgresErrorCode.DEADLOCK_DETECTED:
		case PostgresErrorCode.SERIALIZATION_FAILURE:
			return {
				message: "Database temporarily unavailable, please retry",
				code: ApiErrorCode.SERVICE_UNAVAILABLE,
			};

		default:
			return {
				message: "Database error",
				code: ApiErrorCode.INTERNAL_SERVER_ERROR,
			};
	}
}

export function singleOrNull<T>(rows: T[]): T | null {
	return rows[0] ?? null;
}
