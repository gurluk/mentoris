import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

import { createOfferRepository } from "~/modules/offer/offer.repository";
import { createOfferService } from "~/modules/offer/offer.service";
import { createProfileRepository } from "~/modules/profile/profile.repository";
import { createProfileService } from "~/modules/profile/profile.service";
import { createReviewRepository } from "~/modules/review/review.repository";
import { createReviewService } from "~/modules/review/review.service";
import { createUserRepository } from "~/modules/user/user.repository";
import { createUserService } from "~/modules/user/user.service";

export const applicationPlugin = fp(
  async (app: FastifyInstance) => {
    // Plugins
    const { db } = app;

    // Repositories
    const offerRepository = createOfferRepository({ db });
    const profileRepository = createProfileRepository({ db });
    const reviewRepository = createReviewRepository({ db });
    const userRepository = createUserRepository({ db });

    // Services
    const offerService = createOfferService({ offerRepository });
    const userService = createUserService({ userRepository });
    const profileService = createProfileService({ profileRepository });
    const reviewService = createReviewService({
      reviewRepository,
      offerRepository,
    });

    app.decorate("offerService", offerService);
    app.decorate("reviewService", reviewService);
    app.decorate("profileService", profileService);
    app.decorate("userService", userService);
  },
  {
    name: "application-plugin",
    dependencies: ["db-client-plugin"],
  },
);
