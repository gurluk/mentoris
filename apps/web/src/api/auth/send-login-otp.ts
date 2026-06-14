import { authClient } from "@/lib/auth-client";
import { createMutationHook } from "@/lib/tanstack/createMutationHook";

export async function sendLoginOtp(input: { email: string }) {
  return authClient.emailOtp.sendVerificationOtp({
    email: input.email,
    type: "sign-in",
  });
}

export const useSendLoginOtp = createMutationHook({
  mutationFn: sendLoginOtp,
});
