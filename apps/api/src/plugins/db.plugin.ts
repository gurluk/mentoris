import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

import { db, pool } from "~/db/db";

const dbPlugin = async (fastify: FastifyInstance) => {
	fastify.decorate("db", db);

	fastify.addHook("onClose", async () => {
		await pool.end();
	});
};

export const dbClientPlugin = fp(dbPlugin, { name: "db-client-plugin" });
