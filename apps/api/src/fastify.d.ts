import "@fastify/jwt";
import "fastify";

import { OfferService } from "./modules/offer/offer.service";
import { ProfileService } from "./modules/profile/profile.service";
import { ReviewService } from "./modules/review/review.service";
import { DB } from "./plugins/db.plugin";

declare module "fastify" {
  interface FastifyInstance {
    db: DB;
    offerService: OfferService;
    reviewService: ReviewService;
    profileService: ProfileService;
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
