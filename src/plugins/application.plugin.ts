import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

import { createAuthService } from "~/modules/auth/auth.service";
import { createDictionaryService } from "~/modules/dictionary/dictionary.service";
import { createOfferService } from "~/modules/offer/offer.service";
import { createProfileService } from "~/modules/profile/profile.service";
import { createReviewService } from "~/modules/review/review.service";
import { createRefreshTokenRepository } from "~/modules/token/token/refreshToken.repository";
import { createTokenService } from "~/modules/token/token/token.service";
import { createVerificationTokenRepository } from "~/modules/token/verificationToken/verificationToken.repository";
import { createVerificationTokenService } from "~/modules/token/verificationToken/verificationToken.service";
import { createUserService } from "~/modules/user/user.service";

export const applicationPlugin = fp(
	async (app: FastifyInstance) => {
		// Plugins
		const { db, jwt, emailProvider } = app;

		// Repositories
		const refreshTokenRepository = createRefreshTokenRepository({ db });
		const verificationTokenRepository = createVerificationTokenRepository({
			db,
		});

		// Services
		const offerService = createOfferService({ db });
		const reviewService = createReviewService({ db });
		const dictionaryService = createDictionaryService({ db });
		const tokenService = createTokenService({ jwt });
		const verificationTokenService = createVerificationTokenService({
			verificationTokenRepository,
		});

		const profileService = createProfileService({ db });
		const userService = createUserService({ db });
		const authService = createAuthService({
			refreshTokenRepository,
			emailProvider,
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
