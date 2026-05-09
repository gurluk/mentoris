import { FastifyPluginAsync } from "fastify";

import type { ResendVerificationLinkRequest } from "~/modules/auth/schemas/dto/resend-verification-link.schema";
import { App } from "~/types/app.types";
import { getSignedCookieOrThrow } from "~/utils/cookie.util";

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
		method: "POST",
		url: "/register",
		schema: registerRouteSchema,
		handler: async function registerUser(request, reply) {
			const { email } = await app.authService.register(request.body);
			reply.ok({ data: email });
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

			reply.ok({ data: body.email });
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

			reply.ok({ data: body.email });
		},
	});
};
