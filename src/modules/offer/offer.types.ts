import { DB } from "~/plugins/db.plugin";

import { createOfferService } from "./offer.service";

export type OfferService = ReturnType<typeof createOfferService>;

export type OfferServiceDeps = {
	db: DB;
};
