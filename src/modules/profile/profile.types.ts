import { AppDb } from "~/types/db.types";

import { createProfileService } from "./profile.service";

export type ProfileService = ReturnType<typeof createProfileService>;

export type ProfileServiceDeps = {
	db: AppDb;
};
