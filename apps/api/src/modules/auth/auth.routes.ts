import { fromNodeHeaders } from "better-auth/node";
import { FastifyPluginAsync } from "fastify";

import { App } from "~/app";
import { auth } from "~/lib/auth";
import type { ResendVerificationLinkRequest } from "~/modules/auth/schemas/dto/resend-verification-link.schema";
import { getSignedCookieOrThrow } from "~/shared/utils/cookie.util";

import {
	loginRouteSchema,
	logoutRouteSchema,
	refreshAccessTokenRouteSchema,
	registerRouteSchema,
	requestPasswordResetRouteSchema,
	resendVerificationLinkRouteSchema,
	resetPasswordRouteSchema,
	verifyAccountRouteSchema,
} from "./schemas/route/auth-routes.schema";
import {
	ACCESS_TOKEN_TTL_MS,
	REFRESH_TOKEN_TTL_MS,
} from "../token/token/token.constant";

export const authRoutes: FastifyPluginAsync = async (app: App) => {
	app.route({
		method: ["GET", "POST"],
		url: "*",
		async handler(request, reply) {
			try {
				// Construct request URL
				const url = new URL(request.url, `http://${request.headers.host}`);

				// Convert Fastify headers to standard Headers object
				const headers = fromNodeHeaders(request.headers);
				// Create Fetch API-compatible request
				const req = new Request(url.toString(), {
					method: request.method,
					headers,
					...(request.body ? { body: JSON.stringify(request.body) } : {}),
				});
				// Process authentication request
				const response = await auth.handler(req);
				// Forward response to client
				reply.status(response.status);
				response.headers.forEach((value, key) => reply.header(key, value));
				return reply.send(response.body ? await response.text() : null);
			} catch (_error) {
				return reply.status(500).send({
					error: "Internal authentication error",
					code: "AUTH_FAILURE",
				});
			}
		},
	});

	app.route({
		method: "POST",
		url: "/register",
		schema: registerRouteSchema,
		handler: async function registerUser(request, reply) {
			const { email } = await app.authService.register(request.body);
			reply.created({ data: { email } });
		},
	});

	app.route({
		method: "POST",
		url: "/login",
		schema: loginRouteSchema,
		handler: async function login(request, reply) {
			const { accessToken, refreshToken, email, isVerified } =
				await app.authService.login(request.body);

			reply
				.setCookie("accessToken", accessToken, {
					maxAge: ACCESS_TOKEN_TTL_MS,
				})
				.setCookie("refreshToken", refreshToken, {
					maxAge: REFRESH_TOKEN_TTL_MS,
				});

			reply.ok({ data: { email, isVerified } });
		},
	});

	app.route({
		method: "POST",
		url: "/logout",
		schema: logoutRouteSchema,
		handler: async function logout(request, reply) {
			const refreshToken = getSignedCookieOrThrow(
				app,
				request.cookies.refreshToken,
				{
					missingMessage: "No refresh token cookie",
					invalidMessage: "Invalid refresh token cookie",
				},
			);

			await app.authService.logout(refreshToken);

			reply.clearCookie("refreshToken").clearCookie("accessToken").noContent();
		},
	});

	app.route({
		method: "POST",
		url: "/refresh",
		schema: refreshAccessTokenRouteSchema,
		handler: async function refreshToken(request, reply) {
			const refreshToken = getSignedCookieOrThrow(
				app,
				request.cookies.refreshToken,
				{
					missingMessage: "No refresh token in cookie",
					invalidMessage: "Refresh token is not valid",
				},
			);

			const { accessToken, refreshToken: nextRefreshToken } =
				await app.authService.refresh(refreshToken);

			reply
				.setCookie("accessToken", accessToken, {
					maxAge: ACCESS_TOKEN_TTL_MS,
				})
				.setCookie("refreshToken", nextRefreshToken, {
					maxAge: REFRESH_TOKEN_TTL_MS,
				});

			reply.noContent();
		},
	});

	app.route({
		method: "GET",
		url: "/verify-account",
		schema: verifyAccountRouteSchema,
		handler: async function verifyAccount(request, reply) {
			const { accessToken, refreshToken } =
				await app.authService.verifyUserAndLogin(request.query.token);

			reply
				.setCookie("accessToken", accessToken, {
					maxAge: ACCESS_TOKEN_TTL_MS,
				})
				.setCookie("refreshToken", refreshToken, {
					maxAge: REFRESH_TOKEN_TTL_MS,
				});

			reply.noContent();
		},
	});

	app.route({
		method: "POST",
		url: "/request-reset-password",
		schema: requestPasswordResetRouteSchema,
		handler: async function requestPasswordReset(request, reply) {
			const body = request.body;
			await app.authService.requestResetPassword(body.email);

			reply.ok({ data: { email: body.email } });
		},
	});

	app.route({
		method: "PUT",
		url: "/reset-password",
		schema: resetPasswordRouteSchema,
		handler: async function resetPassword(request, reply) {
			await app.authService.resetPassword(request.body);
			reply.noContent();
		},
	});

	app.route({
		method: "POST",
		url: "/resend-verification-link",
		schema: resendVerificationLinkRouteSchema,
		handler: async function resendVerificationLink(request, reply) {
			const body = request.body as ResendVerificationLinkRequest;
			await app.authService.resendVerificationLink(body.email);

			reply.ok({ data: { email: body.email } });
		},
	});
};
