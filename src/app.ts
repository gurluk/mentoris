import Fastify from "fastify";
import {
	serializerCompiler,
	validatorCompiler,
	ZodTypeProvider,
} from "fastify-type-provider-zod";

import { registerAppRoutes } from "~/app.router";
import { env } from "~/env";
import { dbClientPlugin } from "~/plugins/db.plugin";

import { applicationPlugin } from "./plugins/application.plugin";
import { authPlugin } from "./plugins/auth.plugin";
import { cookiePlugin } from "./plugins/cookie.plugin";
import { corsPlugin } from "./plugins/cors.plugin";
import { emailPlugin } from "./plugins/email.plugin";
import { globalExceptionPlugin } from "./plugins/globalException.plugin";
import { responsePlugin } from "./plugins/response.plugin";
import { swaggerPlugin } from "./plugins/swagger.plugin";
import { uploadFilePlugin } from "./plugins/uploadFile.plugin";

export type App = Awaited<ReturnType<typeof buildApp>>;

export async function buildApp() {
	const baseApp = Fastify({ keepAliveTimeout: 30000 });
	const app = baseApp.withTypeProvider<ZodTypeProvider>();

	// Register Zod so it can be used in routes as schema instead of json schema
	app.setValidatorCompiler(validatorCompiler);
	app.setSerializerCompiler(serializerCompiler);

	// DB client
	app.register(dbClientPlugin);

	// App bootstrap modules, services, repositories
	app.register(applicationPlugin);

	// Email service bootstrap
	app.register(emailPlugin);

	// Cors
	app.register(corsPlugin);

	// JWT check and inject in request object
	app.register(authPlugin);

	// Check cookies
	app.register(cookiePlugin);

	// Global response shape to use inside routes/controllers
	app.register(responsePlugin);

	// Global error response middleware
	app.register(globalExceptionPlugin);
	app.register(uploadFilePlugin);

	// Swagger register to generate swagger shema from routes
	app.register(swaggerPlugin);

	// Routes bootstrap
	app.register(registerAppRoutes, { prefix: "/api" });

	return app;
}

async function startAppServer() {
	const app = await buildApp();

	app.listen({ port: env.PORT, host: "0.0.0.0" }, (err) => {
		if (err) {
			console.log("🚀 ~ startAppServer ~ err:", err);
			// app.log.error(err);
			process.exit(1);
		}

		console.info("ENVIRONMENT =", env.NODE_ENV);
		console.info("PORT =", env.PORT);
	});

	if (env.NODE_ENV === "production") {
		const shutdown = async () => {
			console.info("Shutting down...");
			await app.close();
			process.exit(0);
		};

		process.on("SIGINT", shutdown);
		process.on("SIGTERM", shutdown);
	}
}

startAppServer();
