import nodemailer from "nodemailer";

import { env } from "~/env";

const transporter = nodemailer.createTransport({
  host: env.EMAIL_HOST,
  port: 587,
  auth: {
    user: env.EMAIL_AUTH_USER,
    pass: env.EMAIL_AUTH_PASS,
  },
});

export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
}) {
  await transporter.sendMail({
    to: params.to,
    from: {
      name: "Mentoris",
      address: "noreply@mentorisapp.com",
    },
    subject: params.subject,
    html: params.html,
  });
}
