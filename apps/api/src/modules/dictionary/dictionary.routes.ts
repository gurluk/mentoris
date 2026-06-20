import { FastifyPluginAsync } from "fastify";

import { App } from "~/app";
import { cities, offerCategories } from "~/db/schema";

import {
  getCategoriesRouteSchema,
  getCitiesRouteSchema,
} from "./schemas/route/dictionary-routes.schema";

export const dictionaryRoutes: FastifyPluginAsync = async (app: App) => {
  app.route({
    method: "GET",
    url: "/cities",
    schema: getCitiesRouteSchema,
    handler: async function getCities(_request, reply) {
      const data = await app.db.select().from(cities);
      reply.ok({ data: data });
    },
  });

  app.route({
    method: "GET",
    url: "/categories",
    preHandler: [app.authenticate],
    schema: getCategoriesRouteSchema,
    handler: async function getCategories(request, reply) {
      console.log("USER", request.user);
      console.log("session", request.session);
      const data = await app.db.select().from(offerCategories);
      reply.ok({ data: data });
    },
  });
};
