import { eq } from "drizzle-orm";

import { profiles } from "~/db/schema";
import { DB } from "~/plugins/db.plugin";
import { singleOrNull } from "~/utils/db.util";

import { CreateProfileRequest } from "./schemas/dto/create-profile.schema";
import { UpdateProfileRequest } from "./schemas/dto/update-profile.schema";

type ProfileRepositoryDeps = {
	db: DB;
};

export function createProfileRepository({ db }: ProfileRepositoryDeps) {
	async function create(data: CreateProfileRequest, userId: number) {
		const result = await db
			.insert(profiles)
			.values({
				user_id: userId,
				name: data.name,
				bio: data.bio,
				dob: undefined,
			})
			.returning();

		return singleOrNull(result);
	}

	async function checkExistsProfileByUserId(userId: number) {
		const result = await db
			.select()
			.from(profiles)
			.where(eq(profiles.user_id, userId))
			.limit(1);

		return singleOrNull(result);
	}

	async function update(data: UpdateProfileRequest, userId: number) {
		const result = await db
			.update(profiles)
			.set({
				name: data.name,
				bio: data.bio,
				profile_picture_url: data.profilePicture,
				dob: data.dob?.toISOString(),
			})
			.where(eq(profiles.user_id, userId))
			.returning();

		return singleOrNull(result);
	}

	async function findByUserId(userId: number) {
		return db.query.profiles.findFirst({
			where: eq(profiles.user_id, userId),
		});
	}

	return {
		create,
		checkExistsProfileByUserId,
		update,
		findByUserId,
	};
}

export type ProfileRepository = ReturnType<typeof createProfileRepository>;
