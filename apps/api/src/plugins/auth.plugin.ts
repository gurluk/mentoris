import { fromNodeHeaders } from "better-auth/node";
import { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";

import { App } from "~/app";
import { auth } from "~/lib/auth";

export type Session = typeof auth.$Infer.Session;

export type Authenticate = (
  request: FastifyRequest,
  reply: FastifyReply,
) => Promise<void>;

const authHandler: FastifyPluginAsync = async (app: App) => {
  app.decorateRequest("user");
  app.decorateRequest("session");

  app.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(request.headers),
      });
      // console.log("🚀 ~ authHandler ~ session:", session);

      if (!session) {
        return reply.code(401).send({
          message: "Unauthorized",
        });
      }

      request.user = session.user;
      request.session = session.session;
    },
  );
};

export const authPlugin = fp(authHandler, {
  name: "auth-plugin",
});
