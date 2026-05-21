import SMTPTransport from "nodemailer/lib/smtp-transport";

interface TemplateVariables {
  resetPasswordTemplate: {
    token: string;
  };
  verifyAccountTemplate: {
    token: string;
  };
}

export type EmailTemplateName = keyof TemplateVariables;

export type EmailTemplateParams = {
  [K in keyof TemplateVariables]: {
    name: K;
    variables: TemplateVariables[K];
  };
}[keyof TemplateVariables];

export interface EmailProvider {
  send: (
    userId: number,
    template: EmailTemplateParams,
  ) => Promise<SMTPTransport.SentMessageInfo>;
}
