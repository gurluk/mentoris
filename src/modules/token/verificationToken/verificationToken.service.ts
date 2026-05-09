import { type VerificationTokenContext } from "~/db/schema";
import { TooManyRequestsError } from "~/shared/errors/domain/TooManyRequestsError";
import { minutesFromNow } from "~/utils/datetime.util";
import { hashUtil } from "~/utils/hash.util";
import { generateUuid } from "~/utils/uuid.util";

import { VerificationTokenRepository } from "./verificationToken.repository";

type VerificationTokenServiceDeps = {
	verificationTokenRepository: VerificationTokenRepository;
};

export function createVerificationTokenService({
	verificationTokenRepository,
}: VerificationTokenServiceDeps) {
	const MAX_TOKENS_PER_HOUR = 3;

	async function createVerificationToken(
		userId: number,
		context: VerificationTokenContext,
	) {
		const oneHourAgo = new Date(Date.now() - 1000 * 60 * 60);

		const tokensCreatedCount =
			await verificationTokenRepository.countRecentByUserAndContext(
				userId,
				context,
				oneHourAgo,
			);

		if (tokensCreatedCount >= MAX_TOKENS_PER_HOUR) {
			throw new TooManyRequestsError(
				"Too many attempts. Please try again later.",
			);
		}

		const token = generateUuid();
		const tokenHash = hashUtil.token.hash(token);
		const expiresAt = minutesFromNow(30);

		await verificationTokenRepository.create({
			userId,
			context,
			tokenHash,
			expiresAt,
		});

		return token;
	}

	async function markTokenUsed(rawToken: string) {
		const tokenHash = hashUtil.token.hash(rawToken);
		await verificationTokenRepository.markUsedByTokenHash(tokenHash);
	}

	async function findToken(
		rawToken: string,
		context: VerificationTokenContext,
	) {
		const tokenHash = hashUtil.token.hash(rawToken);

		const token = await verificationTokenRepository.findValidByTokenHash(
			tokenHash,
			context,
		);

		return token;
	}

	return {
		createVerificationToken,
		markTokenUsed,
		findToken,
	};
}

export type VerificationTokenService = ReturnType<
	typeof createVerificationTokenService
>;
