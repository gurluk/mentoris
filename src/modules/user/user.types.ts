import { AppDb } from "~/types/db.types";

import { createUserService } from "./user.service";

export type CreateUserInput = {
	email: string;
	password: string;
};

export type UserService = ReturnType<typeof createUserService>;

export type UserServiceDeps = {
	db: AppDb;
};
