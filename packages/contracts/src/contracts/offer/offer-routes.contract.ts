import { defineRouteContract } from "../../lib/util/defineRouteContract.util";

export const offerRoutes = defineRouteContract({
  prefix: "/offers",

  paths: {
    create: "",
    update: "",
    getOfferById: "/:offerId",
    getMyOffer: "/me",
    createOfferReview: "/:offerId/reviews",
    getOfferReviews: "/:offerId/reviews",
  },

  api: {
    create: () => "",
    update: () => "",
    getMyOffer: () => "/getMyOffer",
    getOfferById: (offerId: number) => `/${offerId}`,
    createOfferReview: (offerId: number) => `/${offerId}/reviews`,
    getOfferReviews: (offerId: number) => `/${offerId}/reviews`,
  },
});
