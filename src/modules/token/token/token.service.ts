import { JWT } from "@fastify/jwt";

import { env } from "~/env";
import { generateUuid } from "~/utils/uuid.util";

import { Role } from "../../auth/auth.constants";

type TokenServiceDeps = {
	jwt: JWT;
};

export function createTokenService({ jwt }: TokenServiceDeps) {
	function signAccessToken(userId: number, role: Role) {
		return jwt.sign(
			{ role, sub: userId.toString() },
			{ expiresIn: env.JWT_ACCESS_TOKEN_EXPIRES_IN },
		);
	}

	function signRefreshToken(jti: string) {
		return jwt.sign({ jti }, { expiresIn: env.JWT_REFRESH_TOKEN_EXPIRES_IN });
	}

	function verifyRefreshToken(token: string) {
		return jwt.verify<{ jti: string }>(token);
	}

	function generateJti() {
		return generateUuid();
	}

	return {
		generateJti,
		signAccessToken,
		signRefreshToken,
		verifyRefreshToken,
	};
}

export type TokenService = ReturnType<typeof createTokenService>;
