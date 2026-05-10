import { eq } from "drizzle-orm";

import { refreshTokens } from "~/db/schema";
import { DB } from "~/plugins/db.plugin";
import { msFromNow } from "~/shared/utils/datetime.util";
import { singleOrNull } from "~/shared/utils/db.util";

import { REFRESH_TOKEN_TTL_MS } from "./token.constant";

type RefreshTokenRepositoryDeps = {
	db: DB;
};

export function createRefreshTokenRepository(deps: RefreshTokenRepositoryDeps) {
	const { db } = deps;

	async function create(data: { jti: string; userId: number }) {
		await db.insert(refreshTokens).values({
			jti: data.jti,
			user_id: data.userId,
			expires_at: msFromNow(REFRESH_TOKEN_TTL_MS),
		});
	}

	async function findByJti(jti: string) {
		const result = await db
			.select()
			.from(refreshTokens)
			.where(eq(refreshTokens.jti, jti))
			.limit(1);

		return singleOrNull(result);
	}

	async function revokeByJti(jti: string) {
		await db
			.update(refreshTokens)
			.set({ revoked: true, updated_at: new Date() })
			.where(eq(refreshTokens.jti, jti));
	}

	return {
		create,
		findByJti,
		revokeByJti,
	};
}

export type RefreshTokenRepository = ReturnType<
	typeof createRefreshTokenRepository
>;
