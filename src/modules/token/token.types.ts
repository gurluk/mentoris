import { JWT } from "@fastify/jwt";

import { AppDb } from "~/types/db.types";

import { createTokenService } from "./token.service";

export type TokenService = ReturnType<typeof createTokenService>;

export type TokenServiceDeps = {
	db: AppDb;
	jwt: JWT;
};
