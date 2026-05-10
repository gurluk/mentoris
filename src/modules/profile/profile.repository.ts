import { eq } from "drizzle-orm";

import { profiles } from "~/db/schema";
import { DB } from "~/plugins/db.plugin";
import { singleOrNull } from "~/shared/utils/db.util";

import { UpdateProfileRequest } from "./schemas/dto/update-profile.schema";

type ProfileRepositoryDeps = {
	db: DB;
};

export function createProfileRepository({ db }: ProfileRepositoryDeps) {
	// Basically used only on registration to insert row with user name
	async function create(name: string, userId: number) {
		const [createdProfile] = await db
			.insert(profiles)
			.values({
				user_id: userId,
				name,
			})
			.returning();

		return createdProfile;
	}

	async function update(data: UpdateProfileRequest, userId: number) {
		const [updatedProfile] = await db
			.update(profiles)
			.set({
				name: data.name,
				bio: data.bio,
				profile_picture_url: data.profilePicture,
				dob: data.dob,
			})
			.where(eq(profiles.user_id, userId))
			.returning();

		return updatedProfile;
	}

	async function findByUserId(userId: number) {
		const result = await db
			.select()
			.from(profiles)
			.where(eq(profiles.user_id, userId))
			.limit(1);

		return singleOrNull(result);
	}

	return {
		create,
		update,
		findByUserId,
	};
}

export type ProfileRepository = ReturnType<typeof createProfileRepository>;
