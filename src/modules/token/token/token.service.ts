import { JWT } from "@fastify/jwt";

import { env } from "~/env";
import { generateUuid } from "~/utils/uuid.util";

import { Role } from "../../auth/auth.constants";

type TokenServiceDeps = {
	jwt: JWT;
};

export function createTokenService(deps: TokenServiceDeps) {
	const { jwt } = deps;

	function generateJti() {
		return generateUuid();
	}

	function issueAccessToken(userId: number, role: Role) {
		return jwt.sign(
			{ role, sub: userId.toString() },
			{ expiresIn: env.JWT_ACCESS_TOKEN_EXPIRES_IN },
		);
	}

	function issueRefreshToken(jti: string) {
		return jwt.sign({ jti }, { expiresIn: env.JWT_REFRESH_TOKEN_EXPIRES_IN });
	}

	function verifyRefreshToken(token: string) {
		return jwt.verify<{ jti: string }>(token);
	}

	return {
		generateJti,
		issueAccessToken,
		issueRefreshToken,
		verifyRefreshToken,
	};
}

export type TokenService = ReturnType<typeof createTokenService>;
