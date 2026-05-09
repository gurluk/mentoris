import "@fastify/jwt";
import "fastify";

import { AuthService } from "./modules/auth/auth.service";
import { DictionaryService } from "./modules/dictionary/dictionary.types";
import { EmailService } from "./modules/email/email.types";
import { OfferService } from "./modules/offer/offer.types";
import { ProfileService } from "./modules/profile/profile.types";
import { ReviewService } from "./modules/review/review.service";
import { TokenService } from "./modules/token/token/token.service";
import { VerificationTokenService } from "./modules/token/verificationToken/verificationToken.service";
import { UserService } from "./modules/user/user.service";
import { DB } from "./plugins/db.plugin";

declare module "fastify" {
	interface FastifyInstance {
		// Database
		db: DB;

		// Services
		emailProvider: EmailService;
		authService: AuthService;
		offerService: OfferService;
		reviewService: ReviewService;
		dictionaryService: DictionaryService;
		tokenService: TokenService;
		verificationTokenService: VerificationTokenService;
		profileService: ProfileService;
		userService: UserService;

		// Auth
		authorize: (
			role: Role,
		) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
	}

	interface FastifyRequest {
		userId: number;
	}
	interface FastifyReply {
		created(options: { data: TData | undefined }): FastifyReply;
		noContent(): FastifyReply;
		ok(options: {
			data: TData | undefined;
			meta?: TMeta | undefined;
		}): FastifyReply;
	}
}

declare module "@fastify/jwt" {
	interface FastifyJWT {
		payload: {
			sub?: string;
			jti?: string;
			role?: string;
		};
	}
}
