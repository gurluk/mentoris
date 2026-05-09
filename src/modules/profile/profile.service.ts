import { ConflictError } from "~/shared/errors/generic/ConflictError";
import { NotFoundError } from "~/shared/errors/generic/NotFoundError";

import type { ProfileRepository } from "./profile.repository";
import { CreateProfileRequest } from "./schemas/dto/create-profile.schema";
import { UpdateProfileRequest } from "./schemas/dto/update-profile.schema";

type ProfileServiceDeps = {
	profileRepository: ProfileRepository;
};

export function createProfileService({
	profileRepository,
}: ProfileServiceDeps) {
	// TODO sanitize multipart fields, trim and clear up
	async function createProfile(payload: CreateProfileRequest, userId: number) {
		const existingProfile =
			await profileRepository.checkExistsProfileByUserId(userId);

		if (existingProfile) throw new ConflictError("Korisnik već postoji");

		const profile = await profileRepository.create(payload, userId);

		if (!profile)
			throw new NotFoundError("Doslo je do greske prilikom kreiranja profila");

		return profile;
	}

	async function checkExistsProfileByUserId(userId: number) {
		return profileRepository.checkExistsProfileByUserId(userId);
	}

	async function updateProfile(payload: UpdateProfileRequest, userId: number) {
		const existingProfile =
			await profileRepository.checkExistsProfileByUserId(userId);

		if (!existingProfile) {
			throw new NotFoundError(
				"Profile you are trying to update does not exist",
			);
		}

		return profileRepository.update(payload, userId);
	}

	async function getProfile(userId: number) {
		const profile = await profileRepository.findByUserId(userId);

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

export type ProfileService = ReturnType<typeof createProfileService>;
