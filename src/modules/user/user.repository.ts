import { and, eq, gt } from "drizzle-orm";

import {
	profiles,
	userRoles,
	users,
	type VerificationTokenContext,
	verificationTokens,
} from "~/db/schema";
import { DB } from "~/plugins/db.plugin";
import { NotFoundError } from "~/shared/errors/generic/NotFoundError";
import { singleOrNull } from "~/utils/db.util";

import { ROLES } from "../auth/auth.constants";

type UserRepositoryDeps = {
	db: DB;
};

export function createUserRepository({ db }: UserRepositoryDeps) {
	async function create(email: string, password: string) {
		return db.transaction(async (tx) => {
			const role = await tx.query.userRoles.findFirst({
				where: eq(userRoles.code, ROLES.USER),
			});

			const roleId = role?.id;

			if (!roleId) throw new NotFoundError("User role assignment went wrong.");

			const [createdUser] = await tx
				.insert(users)
				.values({
					email,
					password,
					role_id: roleId,
				})
				.returning();

			return createdUser;
		});
	}

	async function findByEmail(email: string) {
		return db.query.users.findFirst({
			where: eq(users.email, email),
			with: {
				userRole: {
					columns: { label: true },
				},
			},
		});
	}

	async function findById(userId: number) {
		const result = await db
			.select({
				id: users.id,
				email: users.email,
				isVerified: users.is_verified,
				role: userRoles.label,
				// profile fields
				name: profiles.name,
				profilePictureUrl: profiles.profile_picture_url,
			})
			.from(users)
			.innerJoin(profiles, eq(profiles.user_id, users.id))
			.innerJoin(userRoles, eq(users.role_id, userRoles.id))
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
				role: userRoles.label,
			})
			.from(verificationTokens)
			.innerJoin(users, eq(verificationTokens.user_id, users.id))
			.innerJoin(userRoles, eq(users.role_id, userRoles.id))
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
