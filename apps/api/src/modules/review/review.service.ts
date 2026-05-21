import { ConflictError } from "~/shared/errors/generic/ConflictError";
import { ForbiddenError } from "~/shared/errors/generic/ForbiddenError";
import { NotFoundError } from "~/shared/errors/generic/NotFoundError";

import type { ReviewRepository } from "./review.repository";
import type { CreateReviewRequest } from "./schemas/dto/create-review.schema";
import { OfferRepository } from "../offer/offer.repository";

type ReviewServiceDeps = {
  reviewRepository: ReviewRepository;
  offerRepository: OfferRepository;
};

export function createReviewService({
  reviewRepository,
  offerRepository,
}: ReviewServiceDeps) {
  async function createReview(payload: CreateReviewRequest, userId: number) {
    const offer = await offerRepository.findByOfferId(payload.offerId);

    if (!offer) throw new NotFoundError("Offer not found");

    if (offer.user_id === userId)
      throw new ForbiddenError("You cannot review your own offer!");

    const reviewExists = await reviewRepository.checkUserReviewExistsByOfferId(
      userId,
      payload.offerId,
    );

    if (reviewExists) throw new ConflictError("Review already exists");

    return reviewRepository.create(payload, userId);
  }

  // TODO show review full
  async function getAllActiveOfferReviews(offerId: number) {
    // TODO pagination and sorting
    const reviewsData = await reviewRepository.findAllActiveByOfferId(offerId);

    // TODO map in controller/route
    const reviewsTransformed = reviewsData.map((review) => {
      return {
        ...review,
        user: review.user.profile,
      };
    });

    return reviewsTransformed;
  }

  return {
    createReview,
    getAllActiveOfferReviews,
  };
}

export type ReviewService = ReturnType<typeof createReviewService>;
