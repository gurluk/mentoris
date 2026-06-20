import { emailOTPClient } from "better-auth/client/plugins";
import { nextCookies } from "better-auth/next-js";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3001",
  plugins: [nextCookies(), emailOTPClient()],
});

export type Session = typeof authClient.$Infer.Session;
