import { NotFoundError } from "~/shared/errors/generic/NotFoundError";

import type { ProfileRepository } from "./profile.repository";
import { UpdateProfileRequest } from "./schemas/dto/update-profile.schema";

type ProfileServiceDeps = {
  profileRepository: ProfileRepository;
};

export function createProfileService({
  profileRepository,
}: ProfileServiceDeps) {
  async function updateProfile(payload: UpdateProfileRequest, userId: number) {
    const existingProfile = await profileRepository.findByUserId(userId);

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
    updateProfile,
  };
}

export type ProfileService = ReturnType<typeof createProfileService>;
