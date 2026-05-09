import { DB } from "~/plugins/db.plugin";
import { ConflictError } from "~/shared/errors/generic/ConflictError";
import { ForbiddenError } from "~/shared/errors/generic/ForbiddenError";
import { NotFoundError } from "~/shared/errors/generic/NotFoundError";

import { createReviewRepository } from "./review.repository";
import type { CreateReviewRequest } from "./schemas/dto/create-review.schema";

type ReviewServiceDeps = {
	db: DB;
};

export function createReviewService(deps: ReviewServiceDeps) {
	const { db } = deps;
	const reviewRepository = createReviewRepository({ db });

	async function createReview(payload: CreateReviewRequest, userId: number) {
		const offer = await reviewRepository.findOfferById(payload.offerId);

		if (!offer) throw new NotFoundError("Offer not found");

		if (offer.user_id === userId)
			throw new ForbiddenError("You cannot review your own offer!");

		const reviewExists = await reviewRepository.checkUserReviewExistsByOfferId(
			userId,
			payload.offerId,
		);

		if (reviewExists) {
			throw new ConflictError("Review already exists");
		}

		return reviewRepository.create({
			userId,
			offerId: payload.offerId,
			rating: payload.rating,
			description: payload.description,
		});
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
