import { createAuthService } from "./auth.service";
import { EmailService } from "../email/email.types";
import { ProfileService } from "../profile/profile.types";
import { TokenService } from "../token/token.types";
import { VerificationTokenService } from "../token/verificationToken.services";
import { UserService } from "../user/user.types";

export type AuthService = ReturnType<typeof createAuthService>;

export type AuthServiceDeps = {
	userService: UserService;
	verificationTokenService: VerificationTokenService;
	tokenService: TokenService;
	profileService: ProfileService;
	emailService: EmailService;
};
