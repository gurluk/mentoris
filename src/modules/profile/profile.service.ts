import { eq } from "drizzle-orm";

import { profiles } from "~/db/schema";
import { ConflictError } from "~/shared/errors/generic/ConflictError";
import { NotFoundError } from "~/shared/errors/generic/NotFoundError";

import { ProfileServiceDeps } from "./profile.types";
import { CreateProfileRequest } from "./schemas/dto/create-profile.schema";
import { UpdateProfileRequest } from "./schemas/dto/update-profile.schema";

export function createProfileService(deps: ProfileServiceDeps) {
	const { db } = deps;

	// TODO sanitize multipart fields, trim and clear up
	async function createProfile(body: CreateProfileRequest, userId: number) {
		const existingProfile = await checkExistsProfileByUserId(userId);

		if (existingProfile) throw new ConflictError("Korisnik već postoji");

		const [profile] = await db
			.insert(profiles)
			.values({ user_id: userId, ...body, dob: undefined })
			.returning();

		if (!profile)
			throw new NotFoundError("Doslo je do greske prilikom kreiranja profila");

		return profile;
	}

	async function checkExistsProfileByUserId(userId: number) {
		const result = await db
			.select()
			.from(profiles)
			.where(eq(profiles.user_id, userId))
			.limit(1);
		return result.length > 0;
	}

	async function updateProfile(body: UpdateProfileRequest, userId: number) {
		const existingProfile = await checkExistsProfileByUserId(userId);

		if (!existingProfile) {
			throw new NotFoundError(
				"Profile you are trying to update does not exist",
			);
		}

		const [updatedProfile] = await db
			.update(profiles)
			.set({
				...body,
				profile_picture_url: body.profilePicture,
				dob: body.dob?.toISOString(),
			})
			.where(eq(profiles.user_id, userId))
			.returning();

		return updatedProfile;
	}

	async function getProfile(userId: number) {
		const profile = await db.query.profiles.findFirst({
			where: eq(profiles.user_id, userId),
		});

		if (!profile) throw new NotFoundError("Profile not found.");

		return profile;
	}

	return {
		getProfile,
		createProfile,
		updateProfile,
		checkExistsProfileByUserId,
	};
}
