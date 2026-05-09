import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

import { createAuthService } from "~/modules/auth/auth.service";
import { createDictionaryService } from "~/modules/dictionary/dictionary.service";
import { createOfferRepository } from "~/modules/offer/offer.repository";
import { createOfferService } from "~/modules/offer/offer.service";
import { createProfileRepository } from "~/modules/profile/profile.repository";
import { createProfileService } from "~/modules/profile/profile.service";
import { createReviewRepository } from "~/modules/review/review.repository";
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
		const offerRepository = createOfferRepository({ db });
		const profileRepository = createProfileRepository({ db });
		const reviewRepository = createReviewRepository({ db });
		const refreshTokenRepository = createRefreshTokenRepository({ db });
		const verificationTokenRepository = createVerificationTokenRepository({
			db,
		});

		// Services
		const reviewService = createReviewService({
			reviewRepository,
			offerRepository,
		});
		const offerService = createOfferService({ offerRepository });

		// TODO
		const dictionaryService = createDictionaryService({ db });
		const userService = createUserService({ db });

		const tokenService = createTokenService({ jwt });
		const verificationTokenService = createVerificationTokenService({
			verificationTokenRepository,
		});

		const profileService = createProfileService({ profileRepository });

		const authService = createAuthService({
			refreshTokenRepository,
			profileRepository,
			emailProvider,
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
