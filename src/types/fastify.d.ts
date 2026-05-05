import "@fastify/jwt";
import "fastify";

import { Role } from "~/constants/roles";
import { AuthService } from "~/modules/auth/auth.types";
import { DictionaryService } from "~/modules/dictionary/dictionary.types";
import { OfferService } from "~/modules/offer/offer.types";
import { ProfileService } from "~/modules/profile/profile.types";
import { ReviewService } from "~/modules/review/review.types";
import { TokenService } from "~/modules/token/token.types";
import { VerificationTokenService } from "~/modules/token/verificationToken.services";
import { UserService } from "~/modules/user/user.types";

import { AppDb } from "./db.types";
import { JwtPayload } from "./jwt.types";

declare module "fastify" {
	interface FastifyInstance {
		// DB
		db: AppDb;

		// Services
		emailService: EmailService;
		authService: AuthService;
		offerService: OfferService;
		reviewService: ReviewService;
		dictionaryService: DictionaryService;
		tokenService: TokenService;
		verificationTokenService: VerificationTokenService;
		profileService: ProfileService;
		userService: UserService;

		// Auth
		authorize: (role: Role) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
	}

	interface FastifyRequest {
		userId: number;
	}
	interface FastifyReply {
		ok(options: { data: TData | undefined; meta?: TMeta | undefined }): FastifyReply;
		created(options: { data: TData | undefined }): FastifyReply;
		noContent(): FastifyReply;
	}
}

declare module "@fastify/jwt" {
	interface FastifyJWT {
		payload: JwtPayload;
	}
}
