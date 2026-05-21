import type { EmailTemplateParams } from "./email.types";

export const EMAIL_LINKS = {
  verifyAccount: (token: string) =>
    `http://localhost:4321/verify?token=${token}`,
  resetPassword: (token: string) =>
    `http://localhost:3000/api/auth/reset-password?token=${token}`,
} as const;

export const emailTemplateConfig = {
  verifyAccountTemplate: {
    subject: "Please verify your account",
    variables: (
      template: Extract<
        EmailTemplateParams,
        {
          name: "verifyAccountTemplate";
        }
      >,
    ) => ({
      link: EMAIL_LINKS.verifyAccount(template.variables.token),
    }),
  },
  resetPasswordTemplate: {
    subject: "Reset your password",
    variables: (
      template: Extract<
        EmailTemplateParams,
        {
          name: "resetPasswordTemplate";
        }
      >,
    ) => ({
      link: EMAIL_LINKS.resetPassword(template.variables.token),
    }),
  },
} as const;
