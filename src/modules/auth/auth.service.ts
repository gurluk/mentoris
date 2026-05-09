import { AccountNotVerifiedError } from "~/shared/errors/domain/AccountNotVerifiedError";
import { AlreadyVerifiedError } from "~/shared/errors/domain/AlreadyVerifiedError";
import { InvalidCredentialsError } from "~/shared/errors/domain/InvalidCredentialsError";
import { BadRequestError } from "~/shared/errors/generic/BadRequestError";
import { ConflictError } from "~/shared/errors/generic/ConflictError";
import { NotFoundError } from "~/shared/errors/generic/NotFoundError";
import { hashUtil } from "~/utils/hash.util";

import type { LoginRequest } from "./schemas/dto/login.schema";
import { RegisterUserRequest } from "./schemas/dto/register-user.schema";
import type { ResetPasswordRequest } from "./schemas/dto/reset-password.schema";
import { EmailService } from "../email/email.types";
import { ProfileService } from "../profile/profile.types";
import { RefreshTokenRepository } from "../token/token/refreshToken.repository";
import { TokenService } from "../token/token/token.service";
import { VerificationTokenService } from "../token/verificationToken/verificationToken.service";
import { UserService } from "../user/user.service";

export type AuthServiceDeps = {
	userService: UserService;
	verificationTokenService: VerificationTokenService;
	tokenService: TokenService;
	profileService: ProfileService;
	emailProvider: EmailService;
	refreshTokenRepository: RefreshTokenRepository;
};

export function createAuthService({
	profileService,
	tokenService,
	userService,
	verificationTokenService,
	refreshTokenRepository,
	emailProvider,
}: AuthServiceDeps) {
	async function register(payload: RegisterUserRequest) {
		// TODO switch for repo method
		const isUserExisting = await userService.checkUserExistsByEmail(
			payload.email,
		);

		if (isUserExisting) throw new ConflictError("Email already in use");

		const hashedPassword = await hashUtil.password.hash(payload.password);

		// TODO switch for repo method
		const newUser = await userService.createUser(payload.email, hashedPassword);

		// TODO switch for repo method
		await profileService.createProfile({ name: payload.name }, newUser.id);

		const token = await verificationTokenService.createVerificationToken(
			newUser.id,
			"email_verification",
		);

		emailProvider.send({
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
			await userService.getUserWithValidVerificationToken(
				token,
				"email_verification",
			);

		if (!user) throw new BadRequestError("Invalid verification token.");

		await verificationTokenService.markTokenUsed(storedHashToken.token);

		await userService.verifyUser(user.id);

		const jti = tokenService.generateJti();
		const { role } = await userService.getUserRole(user.id);

		const accessToken = tokenService.signAccessToken(user.id, role);

		const refreshToken = await tokenService.signRefreshToken(jti);

		await refreshTokenRepository.create({
			jti,
			userId: user.id,
		});

		return { accessToken, refreshToken };
	}

	async function login(payload: LoginRequest) {
		const user = await userService.getUserByEmail(payload.email);

		if (!user) throw new InvalidCredentialsError();

		const isPasswordValid = await hashUtil.password.compare(
			payload.password,
			user.password,
		);

		if (!isPasswordValid) throw new InvalidCredentialsError();
		if (!user.is_verified) throw new AccountNotVerifiedError();

		const jti = tokenService.generateJti();

		const userRole = await userService.getUserRole(user.id);

		const accessToken = tokenService.signAccessToken(user.id, userRole.role);
		const refreshToken = await tokenService.signRefreshToken(jti);

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

	async function refresh(oldRefreshToken: string) {
		const payload = tokenService.verifyRefreshToken(oldRefreshToken);

		const storedToken = await refreshTokenRepository.findByJti(payload.jti);

		const isTokenInvalid = !storedToken || storedToken.revoked;

		if (isTokenInvalid)
			throw new InvalidCredentialsError("Token has been revoked or is expired");

		const newJti = tokenService.generateJti();

		const { role } = await userService.getUserRole(storedToken.user_id);

		const accessToken = tokenService.signAccessToken(storedToken.user_id, role);

		const newRefreshToken = await tokenService.signRefreshToken(newJti);

		await refreshTokenRepository.revokeByJti(payload.jti);

		await refreshTokenRepository.create({
			jti: newJti,
			userId: storedToken.user_id,
		});

		return { accessToken, refreshToken: newRefreshToken };
	}

	async function logout(refreshToken: string) {
		const payload = tokenService.verifyRefreshToken(refreshToken);
		await refreshTokenRepository.revokeByJti(payload.jti);
	}

	async function requestResetPassword(email: string) {
		const user = await userService.getUserByEmail(email);

		if (!user.email) {
			// TODO Logger logs error silently
			return;
		}

		const token = await verificationTokenService.createVerificationToken(
			user.id,
			"password_reset",
		);

		emailProvider.send({
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

		await userService.updateUserPassword(
			verificationToken.user_id,
			hashedNewPassword,
		);

		await verificationTokenService.markTokenUsed(payload.token);
	}

	async function resendVerificationLink(email: string) {
		const user = await userService.getUserByEmail(email);

		if (!user) throw new NotFoundError("User not found");

		if (user.is_verified) throw new AlreadyVerifiedError();

		const token = await verificationTokenService.createVerificationToken(
			user.id,
			"email_verification",
		);

		emailProvider.send({
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

export type AuthService = ReturnType<typeof createAuthService>;
