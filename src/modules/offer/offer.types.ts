import { AppDb } from "~/types/db.types";

import { createOfferService } from "./offer.service";

export type OfferService = ReturnType<typeof createOfferService>;

export type OfferServiceDeps = {
	db: AppDb;
};
