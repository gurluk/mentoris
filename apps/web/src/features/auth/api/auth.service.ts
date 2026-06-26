import { authClient } from "@/lib/auth-client";

export async function sendLoginOtp(email: string) {
  return authClient.emailOtp.sendVerificationOtp({
    email,
    type: "sign-in",
  });
}
