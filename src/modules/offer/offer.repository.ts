import { eq } from "drizzle-orm";

import { offers, offersOfferLevels } from "~/db/schema";
import { DB } from "~/plugins/db.plugin";
import { singleOrNull } from "~/utils/db.util";

import { CreateOfferRequest } from "./schemas/dto/create-offer.schema";
import { UpdateOfferRequest } from "./schemas/dto/update-offer.schema";

type OfferRepositoryDeps = {
	db: DB;
};

export function createOfferRepository({ db }: OfferRepositoryDeps) {
	async function create(
		data: CreateOfferRequest & {
			userId: number;
		},
	) {
		return db.transaction(async (tx) => {
			const [offer] = await tx
				.insert(offers)
				.values({
					title: data.title,
					description: data.description,
					price_from_cents: data.priceFromCents,
					price_to_cents: data.priceToCents,
					user_id: data.userId,
				})
				.returning();

			// TODO fix
			// if (categoryIdList.length) {
			// 	await tx.insert(offersOfferCategories).values(
			// 		categoryIdList.map((categoryId) => ({
			// 			offer_id: offer.id,
			// 			category_id: categoryId,
			// 		})),
			// 	);
			// }

			if (data.levelIdList?.length) {
				await tx.insert(offersOfferLevels).values(
					data.levelIdList.map((levelId) => ({
						offer_id: offer.id,
						offer_level_id: levelId,
					})),
				);
			}

			return offer;
		});
	}

	async function update(
		data: UpdateOfferRequest & {
			userId: number;
		},
	) {
		return db.transaction(async (tx) => {
			const [offer] = await tx
				.update(offers)
				.set({
					title: data.title,
					description: data.description,
					price_from_cents: data.price_from_cents,
					price_to_cents: data.price_to_cents,
					updated_at: data.updated_at,
				})
				.where(eq(offers.user_id, data.userId))
				.returning();

			// TODO fix

			// if (categoryIds) {
			// 	await tx.delete(offersOfferCategories).where(eq(offersOfferCategories.offer_id, offer.id));

			// 	await tx.insert(offersOfferCategories).values(
			// 		categoryIds.map((categoryId) => ({
			// 			offer_id: offer.id,
			// 			category_id: categoryId,
			// 		})),
			// 	);
			// }

			return offer;
		});
	}

	async function checkOfferExistsByUserId(userId: number) {
		const result = await db
			.select()
			.from(offers)
			.where(eq(offers.user_id, userId))
			.limit(1);

		return singleOrNull(result);
	}

	async function findByUserId(userId: number) {
		return db.query.offers.findFirst({
			where: eq(offers.user_id, userId),
			with: {
				offersOfferCategories: {
					with: {
						offerCategory: true,
					},
				},
			},
		});
	}

	async function findByOfferId(offerId: number) {
		return db.query.offers.findFirst({
			where: eq(offers.id, offerId),
			with: {
				offersOfferCategories: {
					with: { offerCategory: { columns: { id: true, label: true } } },
					columns: { offer_id: false, category_id: false },
				},
			},
		});
	}

	return {
		create,
		update,
		checkOfferExistsByUserId,
		findByUserId,
		findByOfferId,
	};
}

export type OfferRepository = ReturnType<typeof createOfferRepository>;
