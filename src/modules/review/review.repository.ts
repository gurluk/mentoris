import { and, desc, eq } from "drizzle-orm";

import { offerReviews, offers } from "~/db/schema";
import { DB } from "~/plugins/db.plugin";
import { singleOrNull } from "~/utils/db.util";

import { CreateReviewRequest } from "./schemas/dto/create-review.schema";

type ReviewRepositoryDeps = {
	db: DB;
};

export function createReviewRepository({ db }: ReviewRepositoryDeps) {
	async function findOfferById(offerId: number) {
		return db.query.offers.findFirst({
			where: eq(offers.id, offerId),
			columns: { id: true, user_id: true },
		});
	}

	async function create(
		data: CreateReviewRequest & {
			userId: number;
		},
	) {
		const result = await db
			.insert(offerReviews)
			.values({
				user_id: data.userId,
				offer_id: data.offerId,
				rating: data.rating,
				description: data.description,
			})
			.returning();

		return singleOrNull(result);
	}

	async function findAllActiveByOfferId(offerId: number) {
		return db.query.offerReviews.findMany({
			where: and(
				eq(offerReviews.offer_id, offerId),
				eq(offerReviews.mod_status, "APPROVED"),
			),
			columns: {
				rating: true,
				id: true,
				description: true,
				offer_id: true,
				created_at: true,
			},
			orderBy: desc(offerReviews.created_at),
			limit: 50,
			with: {
				user: {
					with: {
						profile: { columns: { profile_picture_url: true } },
					},
				},
			},
		});
	}

	async function checkUserReviewExistsByOfferId(
		userId: number,
		offerId: number,
	) {
		const result = await db
			.select()
			.from(offerReviews)
			.where(
				and(
					eq(offerReviews.offer_id, offerId),
					eq(offerReviews.user_id, userId),
				),
			)
			.limit(1);

		return singleOrNull(result);
	}

	return {
		findOfferById,
		create,
		findAllActiveByOfferId,
		checkUserReviewExistsByOfferId,
	};
}

export type ReviewRepository = ReturnType<typeof createReviewRepository>;
