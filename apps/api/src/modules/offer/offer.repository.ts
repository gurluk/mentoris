import { eq } from "drizzle-orm";

import { DB } from "~/db/db";
import {
  offers,
  offersOfferCategories,
  offersOfferFormats,
  offersOfferLevels,
} from "~/db/schema";

import { createOfferRelationValues } from "./helpers/createOfferRelationValues";
import { CreateOfferRequest } from "./schemas/dto/create-offer.schema";
import { UpdateOfferRequest } from "./schemas/dto/update-offer.schema";

type OfferRepositoryDeps = {
  db: DB;
};

export function createOfferRepository({ db }: OfferRepositoryDeps) {
  async function create(data: CreateOfferRequest, userId: number) {
    return db.transaction(async (tx) => {
      const [offer] = await tx
        .insert(offers)
        .values({
          title: data.title,
          description: data.description,
          price_from_cents: data.priceFromCents,
          price_to_cents: data.priceToCents,
          user_id: userId,
        })
        .returning();

      await tx
        .insert(offersOfferCategories)
        .values(
          createOfferRelationValues(
            offer.id,
            "offer_category_id",
            data.categoryIdList,
          ),
        );

      await tx
        .insert(offersOfferLevels)
        .values(
          createOfferRelationValues(
            offer.id,
            "offer_level_id",
            data.levelIdList,
          ),
        );

      await tx
        .insert(offersOfferFormats)
        .values(
          createOfferRelationValues(
            offer.id,
            "offer_format_id",
            data.formatIdList,
          ),
        );

      return offer;
    });
  }

  async function update(data: UpdateOfferRequest, userId: number) {
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
        .where(eq(offers.user_id, userId))
        .returning();

      if (data.categoryIdList?.length) {
        await tx
          .delete(offersOfferCategories)
          .where(eq(offersOfferCategories.offer_id, offer.id));
        await tx
          .insert(offersOfferCategories)
          .values(
            createOfferRelationValues(
              offer.id,
              "offer_category_id",
              data.categoryIdList,
            ),
          );
      }

      if (data.levelIdList?.length) {
        await tx
          .delete(offersOfferLevels)
          .where(eq(offersOfferLevels.offer_id, offer.id));
        await tx
          .insert(offersOfferLevels)
          .values(
            createOfferRelationValues(
              offer.id,
              "offer_level_id",
              data.levelIdList,
            ),
          );
      }

      if (data.formatIdList?.length) {
        await tx
          .delete(offersOfferFormats)
          .where(eq(offersOfferFormats.offer_id, offer.id));
        await tx
          .insert(offersOfferFormats)
          .values(
            createOfferRelationValues(
              offer.id,
              "offer_format_id",
              data.formatIdList,
            ),
          );
      }

      return offer;
    });
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
    findByUserId,
    findByOfferId,
  };
}

export type OfferRepository = ReturnType<typeof createOfferRepository>;
