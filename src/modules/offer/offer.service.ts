import { ConflictError } from "~/shared/errors/generic/ConflictError";
import { NotFoundError } from "~/shared/errors/generic/NotFoundError";

import type { OfferRepository } from "./offer.repository";
import type { CreateOfferRequest } from "./schemas/dto/create-offer.schema";
import type { UpdateOfferRequest } from "./schemas/dto/update-offer.schema";

type OfferServiceDeps = {
	offerRepository: OfferRepository;
};

export function createOfferService({ offerRepository }: OfferServiceDeps) {
	async function createOffer(payload: CreateOfferRequest, userId: number) {
		const existingOffer = await offerRepository.findByUserId(userId);

		if (existingOffer)
			throw new ConflictError("Offer already exists for this user");

		return offerRepository.create(payload, userId);
	}

	async function updateOffer(payload: UpdateOfferRequest, userId: number) {
		const existingOffer = await offerRepository.findByUserId(userId);

		if (!existingOffer)
			throw new NotFoundError("Offer you are trying to update does not exist");

		return offerRepository.update(payload, userId);
	}

	async function getOfferByUserId(userId: number) {
		const offer = await offerRepository.findByUserId(userId);

		if (!offer) throw new NotFoundError("Offer does not exist");

		const { offersOfferCategories, ...restOffer } = offer;

		const transformedOffer = {
			...restOffer,
			categories: offersOfferCategories.map((oc) => oc.offerCategory),
		};

		return transformedOffer;
	}

	async function getOfferByOfferId(offerId: number) {
		const offer = await offerRepository.findByOfferId(offerId);

		if (!offer) throw new NotFoundError("Offer does not exist");

		return offer;
	}

	return { createOffer, updateOffer, getOfferByUserId, getOfferByOfferId };
}

export type OfferService = ReturnType<typeof createOfferService>;
