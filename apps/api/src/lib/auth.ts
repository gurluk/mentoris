import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP } from "better-auth/plugins";

import { db } from "~/db/db";
import { sendEmailOTP } from "~/modules/email/otp";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  trustedOrigins: ["http://localhost:3000", "127.0.0.0"],
  emailAndPassword: { enabled: true, autoSignIn: true },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp }) {
        void sendEmailOTP(email, otp).catch((error) => {
          console.error("Failed to send OTP email", error);
        });
      },
    }),
  ],
});
