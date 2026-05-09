import { DB } from "~/plugins/db.plugin";

import { createProfileService } from "./profile.service";

export type ProfileService = ReturnType<typeof createProfileService>;

export type ProfileServiceDeps = {
	db: DB;
};
