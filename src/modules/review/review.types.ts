import { DB } from "~/plugins/db.plugin";

import { createReviewService } from "./review.service";

export type ReviewService = ReturnType<typeof createReviewService>;

export type ReviewServiceDeps = {
	db: DB;
};

// TODO deps
