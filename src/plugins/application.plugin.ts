import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

import { createAuthService } from "~/modules/auth/auth.service";
import { createDictionaryService } from "~/modules/dictionary/dictionary.service";
import { createOfferService } from "~/modules/offer/offer.service";
import { createProfileService } from "~/modules/profile/profile.service";
import { createReviewService } from "~/modules/review/review.service";
import { createTokenService } from "~/modules/token/token.service";
import { createVerificationTokensService } from "~/modules/token/verificationToken.services";
import { createUserService } from "~/modules/user/user.service";

export const applicationPlugin = fp(
	async (app: FastifyInstance) => {
		// App attached services/plugins
		const db = app.db;
		const jwt = app.jwt;
		const emailService = app.emailService;

		// Services
		const offerService = createOfferService({ db });
		const reviewService = createReviewService({ db });
		const dictionaryService = createDictionaryService({ db });
		const tokenService = createTokenService({ db, jwt });
		const verificationTokenService = createVerificationTokensService({
			db,
			jwt,
		});
		const profileService = createProfileService({ db });
		const userService = createUserService({ db });
		const authService = createAuthService({
			emailService,
			profileService,
			tokenService,
			userService,
			verificationTokenService,
		});

		app.decorate("authService", authService);
		app.decorate("offerService", offerService);
		app.decorate("reviewService", reviewService);
		app.decorate("dictionaryService", dictionaryService);
		app.decorate("tokenService", tokenService);
		app.decorate("verificationTokenService", verificationTokenService);
		app.decorate("profileService", profileService);
		app.decorate("userService", userService);
	},
	{
		name: "application-plugin",
		dependencies: ["db-client-plugin"],
	},
);
