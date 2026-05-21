import { NotFoundError } from "~/shared/errors/generic/NotFoundError";

import type { UserRepository } from "./user.repository";

type UserServiceDeps = {
  userRepository: UserRepository;
};

export function createUserService({ userRepository }: UserServiceDeps) {
  async function getCurrentUser(userId: number) {
    const user = await userRepository.findById(userId);

    if (!user) throw new NotFoundError("User not found.");

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      profilePictureUrl: user.profilePictureUrl,
      isVerified: user.isVerified,
    };
  }

  return {
    getCurrentUser,
  };
}

export type UserService = ReturnType<typeof createUserService>;
