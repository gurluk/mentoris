import { FastifyPluginAsync } from "fastify";

import { App } from "~/app";
import { createAuthGuards } from "~/shared/utils/createAuthGuards.util";

import { ProfileDtoSchema } from "./schemas/dto/profile.dto";
import {
  getProfileRouteSchema,
  updateProfileRouteSchema,
} from "./schemas/route/profile-routes.schema";

export const profileRoutes: FastifyPluginAsync = async (app: App) => {
  const { authorizeUser } = createAuthGuards(app);

  app.route({
    method: "PUT",
    url: "",
    schema: updateProfileRouteSchema,
    onRequest: authorizeUser,
    handler: async function updateProfile(request, reply) {
      const updatedProfile = await app.profileService.updateProfile(
        request.body,
        request.userId,
      );
      const data = ProfileDtoSchema.parse(updatedProfile);
      reply.ok({ data });
    },
  });

  app.route({
    method: "GET",
    url: "/me",
    onRequest: authorizeUser,
    schema: getProfileRouteSchema,
    handler: async function getUserProfile(request, reply) {
      const profile = await app.profileService.getProfile(request.userId);
      const data = ProfileDtoSchema.parse(profile);
      reply.ok({ data });
    },
  });
};
