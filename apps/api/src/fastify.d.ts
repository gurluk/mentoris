import "fastify";

import { OfferService } from "./modules/offer/offer.service";
import { ProfileService } from "./modules/profile/profile.service";
import { ReviewService } from "./modules/review/review.service";
import { Authenticate, Session } from "./plugins/auth.plugin";
import { DB } from "./plugins/db.plugin";

declare module "fastify" {
  interface FastifyInstance {
    db: DB;
    offerService: OfferService;
    reviewService: ReviewService;
    profileService: ProfileService;
    authenticate: Authenticate;
  }

  interface FastifyRequest {
    user: Session["user"];
    session: Session["session"];
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
