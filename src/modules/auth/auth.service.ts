import { AccountNotVerifiedError } from "~/shared/errors/domain/AccountNotVerifiedError";
import { AlreadyVerifiedError } from "~/shared/errors/domain/AlreadyVerifiedError";
import { InvalidCredentialsError } from "~/shared/errors/domain/InvalidCredentialsError";
import { BadRequestError } from "~/shared/errors/generic/BadRequestError";
import { ConflictError } from "~/shared/errors/generic/ConflictError";
import { NotFoundError } from "~/shared/errors/generic/NotFoundError";
import { hashUtil } from "~/utils/hash.util";

import { Role } from "./auth.constants";
import type { LoginRequest } from "./schemas/dto/login.schema";
import { RegisterUserRequest } from "./schemas/dto/register-user.schema";
import type { ResetPasswordRequest } from "./schemas/dto/reset-password.schema";
import { EmailProvider } from "../email/email.types";
import { ProfileRepository } from "../profile/profile.repository";
import { RefreshTokenRepository } from "../token/token/refreshToken.repository";
import { TokenService } from "../token/token/token.service";
import { VerificationTokenService } from "../token/verificationToken/verificationToken.service";
import { UserRepository } from "../user/user.repository";

export type AuthServiceDeps = {
	userRepository: UserRepository;
	verificationTokenService: VerificationTokenService;
	tokenService: TokenService;
	emailProvider: EmailProvider;
	profileRepository: ProfileRepository;
	refreshTokenRepository: RefreshTokenRepository;
};

export function createAuthService({
	tokenService,
	verificationTokenService,
	userRepository,
	profileRepository,
	refreshTokenRepository,
	emailProvider,
}: AuthServiceDeps) {
	async function register(payload: RegisterUserRequest) {
		const isUserExisting = await userRepository.findByEmail(payload.email);

		if (isUserExisting) throw new ConflictError("Email already in use");

		const hashedPassword = await hashUtil.password.hash(payload.password);

		const newUser = await userRepository.create(payload.email, hashedPassword);

		await profileRepository.create({ name: payload.name }, newUser.id);

		const token = await verificationTokenService.createVerificationToken(
			newUser.id,
			"email_verification",
		);

		emailProvider.send(newUser.id, {
			name: "verifyAccountTemplate",
			variables: {
				token,
			},
		});

		return { userId: newUser.id, email: newUser.email };
	}

	async function login(payload: LoginRequest) {
		const user = await userRepository.findByEmail(payload.email);

		if (!user) throw new InvalidCredentialsError();

		const isPasswordValid = await hashUtil.password.compare(
			payload.password,
			user.password,
		);

		if (!isPasswordValid) throw new InvalidCredentialsError();
		if (!user.is_verified) throw new AccountNotVerifiedError();

		const jti = tokenService.generateJti();

		const accessToken = tokenService.signAccessToken(
			user.id,
			user.role as Role,
		);

		const refreshToken = tokenService.signRefreshToken(jti);

		await refreshTokenRepository.create({
			jti,
			userId: user.id,
		});

		return {
			accessToken,
			refreshToken,
			isVerified: user.is_verified,
			email: user.email,
		};
	}

	async function logout(refreshToken: string) {
		const payload = tokenService.verifyRefreshToken(refreshToken);
		await refreshTokenRepository.revokeByJti(payload.jti);
	}

	async function verifyUserAndLogin(token: string) {
		const hashedPayloadToken = hashUtil.token.hash(token);

		const verificationResult =
			await userRepository.findByValidVerificationToken(
				hashedPayloadToken,
				"email_verification",
			);

		if (!verificationResult?.user)
			throw new BadRequestError("Invalid verification token.");

		const { user } = verificationResult;

		await verificationTokenService.markTokenUsed(token);

		await userRepository.verifyById(user.id);

		const jti = tokenService.generateJti();

		const accessToken = tokenService.signAccessToken(
			user.id,
			verificationResult.role as Role,
		);
		const refreshToken = tokenService.signRefreshToken(jti);

		await refreshTokenRepository.create({
			jti,
			userId: user.id,
		});

		return { accessToken, refreshToken };
	}

	async function refresh(oldRefreshToken: string) {
		const payload = tokenService.verifyRefreshToken(oldRefreshToken);

		const storedToken = await refreshTokenRepository.findByJti(payload.jti);

		const isTokenInvalid = !storedToken || storedToken.revoked;

		if (isTokenInvalid)
			throw new InvalidCredentialsError("Token has been revoked or is expired");

		const newJti = tokenService.generateJti();

		const user = await userRepository.findById(storedToken.user_id);

		if (!user) throw new NotFoundError("User not found");

		const accessToken = tokenService.signAccessToken(
			storedToken.user_id,
			user.role as Role,
		);

		const newRefreshToken = tokenService.signRefreshToken(newJti);

		await refreshTokenRepository.revokeByJti(payload.jti);

		await refreshTokenRepository.create({
			jti: newJti,
			userId: storedToken.user_id,
		});

		return { accessToken, refreshToken: newRefreshToken };
	}

	async function requestResetPassword(email: string) {
		const user = await userRepository.findByEmail(email);

		if (!user) throw new NotFoundError("User not found");

		const token = await verificationTokenService.createVerificationToken(
			user.id,
			"password_reset",
		);

		emailProvider.send(user.id, {
			name: "resetPasswordTemplate",
			variables: {
				token,
			},
		});
	}

	async function resetPassword(payload: ResetPasswordRequest) {
		const verificationToken = await verificationTokenService.findToken(
			payload.token,
			"password_reset",
		);

		if (!verificationToken?.token)
			throw new BadRequestError("Invalid verification token");

		const isTokenValid = hashUtil.token.compare(
			payload.token,
			verificationToken.token,
		);

		if (!isTokenValid) throw new BadRequestError("Invalid verification token");

		const hashedNewPassword = await hashUtil.password.hash(payload.newPassword);

		await userRepository.updatePassword(
			verificationToken.user_id,
			hashedNewPassword,
		);

		await verificationTokenService.markTokenUsed(payload.token);
	}

	async function resendVerificationLink(email: string) {
		const user = await userRepository.findByEmail(email);

		if (!user) throw new NotFoundError("User not found");

		if (user.is_verified) throw new AlreadyVerifiedError();

		const token = await verificationTokenService.createVerificationToken(
			user.id,
			"email_verification",
		);

		emailProvider.send(user.id, {
			name: "verifyAccountTemplate",
			variables: {
				token,
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

export type AuthService = ReturnType<typeof createAuthService>;
