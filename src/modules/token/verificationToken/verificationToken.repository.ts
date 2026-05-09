import { and, eq, gt, sql } from "drizzle-orm";

import { type VerificationTokenContext, verificationTokens } from "~/db/schema";
import { DB } from "~/plugins/db.plugin";
import { singleOrNull } from "~/utils/db.util";

type VerificationTokenRepositoryDeps = {
	db: DB;
};

export function createVerificationTokenRepository(
	deps: VerificationTokenRepositoryDeps,
) {
	const { db } = deps;

	async function countRecentByUserAndContext(
		userId: number,
		context: VerificationTokenContext,
		since: Date,
	) {
		const [{ count }] = await db
			.select({ count: sql<number>`COUNT(*)` })
			.from(verificationTokens)
			.where(
				and(
					eq(verificationTokens.user_id, userId),
					eq(verificationTokens.context, context),
					gt(verificationTokens.created_at, since),
				),
			);

		return Number(count);
	}

	async function create(data: {
		userId: number;
		context: VerificationTokenContext;
		tokenHash: string;
		expiresAt: Date;
	}) {
		await db.insert(verificationTokens).values({
			user_id: data.userId,
			context: data.context,
			token: data.tokenHash,
			expires_at: data.expiresAt,
		});
	}

	async function markUsedByTokenHash(tokenHash: string) {
		await db
			.update(verificationTokens)
			.set({
				used: true,
				updated_at: new Date(),
			})
			.where(eq(verificationTokens.token, tokenHash));
	}

	async function findValidByTokenHash(
		tokenHash: string,
		context: VerificationTokenContext,
	) {
		const result = await db
			.select()
			.from(verificationTokens)
			.where(
				and(
					eq(verificationTokens.token, tokenHash),
					eq(verificationTokens.context, context),
					eq(verificationTokens.used, false),
					gt(verificationTokens.expires_at, new Date()),
				),
			)
			.limit(1);

		return singleOrNull(result);
	}

	return {
		countRecentByUserAndContext,
		create,
		markUsedByTokenHash,
		findValidByTokenHash,
	};
}

export type VerificationTokenRepository = ReturnType<
	typeof createVerificationTokenRepository
>;
