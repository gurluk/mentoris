import "@fastify/jwt";
import "fastify";

import { OfferService } from "./modules/offer/offer.service";
import { ProfileService } from "./modules/profile/profile.service";
import { ReviewService } from "./modules/review/review.service";
import { UserService } from "./modules/user/user.service";
import { DB } from "./plugins/db.plugin";

declare module "fastify" {
  interface FastifyInstance {
    // Database
    db: DB;

    // Services
    offerService: OfferService;
    reviewService: ReviewService;
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
