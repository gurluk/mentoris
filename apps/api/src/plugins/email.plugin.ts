import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import type { Transporter } from "nodemailer";
import nodemailer from "nodemailer";

import { env } from "~/env";
import { emailTemplateConfig } from "~/modules/email/email.config";
import type {
  EmailProvider,
  EmailTemplateParams,
} from "~/modules/email/email.types";
import { createEmailRenderer } from "~/modules/email/renderEmail.util";
import { createUserRepository } from "~/modules/user/user.repository";

function getTemplateVariables(template: EmailTemplateParams) {
  switch (template.name) {
    case "verifyAccountTemplate":
      return emailTemplateConfig.verifyAccountTemplate.variables(template);
    case "resetPasswordTemplate":
      return emailTemplateConfig.resetPasswordTemplate.variables(template);
  }
}

function createEmailProvider(deps: {
  transporter: Transporter;
  userRepository: ReturnType<typeof createUserRepository>;
}): EmailProvider {
  const renderer = createEmailRenderer();

  return {
    send: async (userId, template) => {
      const user = await deps.userRepository.findById(userId);

      if (!user)
        throw new Error(`Cannot send email to unknown user: ${userId}`);

      const config = emailTemplateConfig[template.name];
      const html = renderer.render(
        template.name,
        getTemplateVariables(template),
      );

      return deps.transporter.sendMail({
        to: user.email,
        from: {
          name: "Mentoris App",
          address: "noreply@mentorisapp.com",
        },
        subject: config.subject,
        html,
      });
    },
  };
}

const emailPluginHandler: FastifyPluginAsync = async (app) => {
  const transporter = nodemailer.createTransport({
    host: env.EMAIL_HOST,
    port: 587,
    auth: {
      user: env.EMAIL_AUTH_USER,
      pass: env.EMAIL_AUTH_PASS,
    },
  });

  const userRepository = createUserRepository({ db: app.db });
  const emailService = createEmailProvider({ transporter, userRepository });

  app.decorate("emailProvider", emailService);
};

export const emailPlugin = fp(emailPluginHandler, {
  name: "email-plugin",
  dependencies: ["db-client-plugin"],
});
