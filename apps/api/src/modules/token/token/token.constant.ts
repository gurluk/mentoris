import { env } from "~/env";
import { parseDurationMs } from "~/shared/utils/datetime.util";

export const REFRESH_TOKEN_TTL_MS = parseDurationMs(
	env.JWT_REFRESH_TOKEN_EXPIRES_IN,
);

export const ACCESS_TOKEN_TTL_MS = parseDurationMs(
	env.JWT_REFRESH_TOKEN_EXPIRES_IN,
);
