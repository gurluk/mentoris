import { sendEmail } from "~/modules/email/send-email";

import { renderEmail } from "./render-email";

export async function sendEmailOTP(email: string, otp: string) {
  const html = renderEmail("otp", {
    otp,
  });

  await sendEmail({
    to: email,
    subject: "Your login code",
    html,
  });
}
