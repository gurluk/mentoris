import { AppDb } from "~/types/db.types";

import { createReviewService } from "./review.service";

export type ReviewService = ReturnType<typeof createReviewService>;

export type ReviewServiceDeps = {
	db: AppDb;
};

// TODO deps
