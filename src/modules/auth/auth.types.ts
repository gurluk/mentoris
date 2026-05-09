import { createAuthService } from "./auth.service";
import { EmailService } from "../email/email.types";
import { ProfileService } from "../profile/profile.types";
import { RefreshTokenRepository } from "../token/token/refreshToken.repository";
import { TokenService } from "../token/token/token.service";
import { VerificationTokenService } from "../token/verificationToken/verificationToken.service";
import { UserService } from "../user/user.types";

export type AuthService = ReturnType<typeof createAuthService>;

export type AuthServiceDeps = {
	userService: UserService;
	verificationTokenService: VerificationTokenService;
	tokenService: TokenService;
	profileService: ProfileService;
	emailProvider: EmailService;
	refreshTokenRepository: RefreshTokenRepository;
};
