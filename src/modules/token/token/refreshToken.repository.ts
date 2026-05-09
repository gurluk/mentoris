import { eq } from "drizzle-orm";

import { refreshTokens } from "~/db/schema";
import { AppDb } from "~/types/db.types";
import { singleOrNull } from "~/utils/db.util";

type RefreshTokenRepositoryDeps = {
	db: AppDb;
};

export function createRefreshTokenRepository(deps: RefreshTokenRepositoryDeps) {
	const { db } = deps;

	async function create(data: {
		jti: string;
		userId: number;
		expiresAt: Date;
	}) {
		await db.insert(refreshTokens).values({
			jti: data.jti,
			user_id: data.userId,
			expires_at: data.expiresAt,
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
