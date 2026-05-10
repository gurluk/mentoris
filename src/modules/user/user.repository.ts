import { and, eq, gt } from "drizzle-orm";

import {
	profiles,
	users,
	type VerificationTokenContext,
	verificationTokens,
} from "~/db/schema";
import { DB } from "~/plugins/db.plugin";
import { singleOrNull } from "~/shared/utils/db.util";

import { ROLES } from "../auth/auth.constants";

type UserRepositoryDeps = {
	db: DB;
};

export function createUserRepository({ db }: UserRepositoryDeps) {
	async function create(email: string, hashedPassword: string) {
		const [createdUser] = await db
			.insert(users)
			.values({
				email,
				password: hashedPassword,
				role: ROLES.USER,
			})
			.returning();

		return createdUser;
	}

	async function findByEmail(email: string) {
		return db.query.users.findFirst({
			where: eq(users.email, email),
		});
	}

	async function findById(userId: number) {
		const result = await db
			.select({
				id: users.id,
				email: users.email,
				isVerified: users.is_verified,
				role: users.role,

				// profile fields
				name: profiles.name,
				profilePictureUrl: profiles.profile_picture_url,
			})
			.from(users)
			.innerJoin(profiles, eq(profiles.user_id, users.id))
			.where(eq(users.id, userId))
			.limit(1);

		return singleOrNull(result);
	}

	async function verifyById(userId: number) {
		await db
			.update(users)
			.set({ is_verified: true, updated_at: new Date() })
			.where(eq(users.id, userId));
	}

	async function findByValidVerificationToken(
		tokenHash: string,
		context: VerificationTokenContext,
	) {
		const result = await db
			.select({
				user: users,
				token: verificationTokens,
				role: users.role,
			})
			.from(verificationTokens)
			.innerJoin(users, eq(verificationTokens.user_id, users.id))
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

	async function updatePassword(userId: number, hashedPassword: string) {
		await db
			.update(users)
			.set({ password: hashedPassword, updated_at: new Date() })
			.where(eq(users.id, userId));
	}

	return {
		create,
		findByEmail,
		findById,
		verifyById,
		findByValidVerificationToken,
		updatePassword,
	};
}

export type UserRepository = ReturnType<typeof createUserRepository>;
