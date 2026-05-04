import { AccountNotVerifiedError } from "~/shared/errors/domain/AccountNotVerifiedError";
import { AlreadyVerifiedError } from "~/shared/errors/domain/AlreadyVerifiedError";
import { InvalidCredentialsError } from "~/shared/errors/domain/InvalidCredentialsError";
import { BadRequestError } from "~/shared/errors/generic/BadRequestError";
import { ConflictError } from "~/shared/errors/generic/ConflictError";
import { NotFoundError } from "~/shared/errors/generic/NotFoundError";
import { App } from "~/types/app.types";
import { hashUtil } from "~/utils/hash.util";

import type { LoginRequest } from "./schemas/dto/login.schema";
import { RegisterUserRequest } from "./schemas/dto/register-user.schema";
import type { ResetPasswordRequest } from "./schemas/dto/reset-password.schema";

export function createAuthService(app: App) {
	async function register(payload: RegisterUserRequest) {
		const isUserExisting = await app.userService.checkUserExistsByEmail(payload.email);

		if (isUserExisting) throw new ConflictError("Email already in use");

		const hashedPassword = await hashUtil.password.hash(payload.password);

		const newUser = await app.userService.createUser({
			email: payload.email,
			password: hashedPassword,
		});

		await app.profileService.createProfile({ name: payload.name }, newUser.id);

		const token = await app.verificationTokenService.createVerificationToken(
			newUser.id,
			"email_verification",
		);

		app.email.send({
			to: newUser.email,
			// TODO environment domain/host, just needs to pass the token
			template: {
				name: "verifyAccountTemplate",
				variables: {
					link: `http://localhost:4321/verify?token=${token}`,
				},
			},
		});

		return { userId: newUser.id, email: newUser.email };
	}

	async function verifyUserAndLogin(token: string) {
		const { user, token: storedHashToken } =
			await app.userService.getUserWithValidVerificationToken(token, "email_verification");

		if (!user) throw new BadRequestError("Invalid verification token.");

		await app.verificationTokenService.markTokenUsed(storedHashToken.token);
		await app.userService.verifyUser(user.id);

		const jti = app.tokenService.generateJti();
		const { role } = await app.userService.getUserRole(user.id);

		const accessToken = app.tokenService.issueAccessToken(user.id, role);
		const refreshToken = await app.tokenService.issueRefreshToken(user.id, jti);

		return { accessToken, refreshToken };
	}

	async function login(payload: LoginRequest) {
		const user = await app.userService.getUserByEmail(payload.email);

		if (!user) throw new InvalidCredentialsError();

		const isPasswordValid = await hashUtil.password.compare(payload.password, user.password);

		if (!isPasswordValid) throw new InvalidCredentialsError();

		if (!user.is_verified) throw new AccountNotVerifiedError();

		const jti = app.tokenService.generateJti();

		const userRole = await app.userService.getUserRole(user.id);

		const accessToken = app.tokenService.issueAccessToken(user.id, userRole.role);
		const refreshToken = await app.tokenService.issueRefreshToken(user.id, jti);

		return { accessToken, refreshToken, isVerified: user.is_verified, email: user.email };
	}

	async function refresh(oldRefreshToken: string) {
		const payload = app.tokenService.verifyRefreshToken(oldRefreshToken);
		const storedToken = await app.tokenService.getRefreshTokenByJti(payload.jti);

		const isTokenInvalid = !storedToken || storedToken.revoked;

		if (isTokenInvalid) throw new InvalidCredentialsError("Token has been revoked or is expired");

		const newJti = app.tokenService.generateJti();

		const { role } = await app.userService.getUserRole(storedToken.user_id);

		const accessToken = app.tokenService.issueAccessToken(storedToken.user_id, role);
		const newRefreshToken = await app.tokenService.issueRefreshToken(storedToken.user_id, newJti);

		await app.tokenService.revokeRefreshToken(oldRefreshToken);

		return { accessToken, refreshToken: newRefreshToken };
	}

	async function logout(refreshToken: string) {
		await app.tokenService.revokeRefreshToken(refreshToken);
	}

	async function requestResetPassword(email: string) {
		const user = await app.userService.getUserByEmail(email);

		if (!user.email) {
			// TODO Logger logs error silently
			return;
		}

		const token = await app.verificationTokenService.createVerificationToken(
			user.id,
			"password_reset",
		);

		app.email.send({
			to: user.email,
			template: {
				name: "resetPasswordTemplate",
				variables: {
					email: user.email,
					// TODO environment dynamic domain/host, just needs to pass the token
					// TODO Frontend route should be included here and call this endpoint en route to verify, for now use direct endpoint
					link: `http://localhost:3000/api/auth/reset-password?token=${token}`,
				},
			},
		});
	}

	async function resetPassword(payload: ResetPasswordRequest) {
		const hashedPayloadToken = hashUtil.token.hash(payload.token);

		const user = await app.userService.getUserWithValidVerificationToken(
			hashedPayloadToken,
			"password_reset",
		);

		if (!user) {
			throw new NotFoundError("Password reset request token not found");
		}

		const isTokenValidOrExists = hashUtil.token.compare(payload.token, user.token.token);

		if (!isTokenValidOrExists) {
			throw new NotFoundError("Password reset request token not found");
		}

		await app.verificationTokenService.markTokenUsed(hashedPayloadToken);

		const hashedNewPassword = await hashUtil.password.hash(payload.newPassword);

		await app.userService.updateUserPassword(user.user.id, hashedNewPassword);
	}

	async function resendVerificationLink(email: string) {
		const user = await app.userService.getUserByEmail(email);

		if (!user) throw new NotFoundError("User not found");

		if (user.is_verified) throw new AlreadyVerifiedError();

		const token = await app.verificationTokenService.createVerificationToken(
			user.id,
			"email_verification",
		);

		app.email.send({
			to: user.email,
			template: {
				name: "verifyAccountTemplate",
				variables: {
					// TODO environment dynamic domain/host, just needs to pass the token
					// TODO Frontend route should be included here and call this endpoint en route to verify, for now use direct endpoint
					link: `http://localhost:3000/api/auth/verify-account?token=${token}`,
				},
			},
		});
	}

	return {
		resendVerificationLink,
		resetPassword,
		requestResetPassword,
		register,
		verifyUserAndLogin,
		login,
		refresh,
		logout,
	};
}
