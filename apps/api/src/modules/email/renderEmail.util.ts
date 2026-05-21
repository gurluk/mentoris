import fs from "fs";
import Handlebars from "handlebars";
import path from "path";
import { fileURLToPath } from "url";

import type { EmailTemplateName } from "~/modules/email/email.types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type RenderVariables = Record<string, unknown>;

export function createEmailRenderer() {
  const templatesDir = path.join(__dirname, "templates");
  const templates = new Map<
    EmailTemplateName,
    Handlebars.TemplateDelegate<RenderVariables>
  >();

  for (const file of fs.readdirSync(templatesDir)) {
    if (!file.endsWith(".hbs")) continue;

    const name = file.replace(".hbs", "") as EmailTemplateName;
    const templatePath = path.join(templatesDir, file);
    const templateSource = fs.readFileSync(templatePath, "utf8");

    templates.set(name, Handlebars.compile(templateSource));
  }

  return {
    render: (name: EmailTemplateName, variables: RenderVariables) => {
      const template = templates.get(name);

      if (!template) throw new Error(`Email template not loaded: ${name}`);

      return template({
        ...variables,
        year: new Date().getFullYear(),
      });
    },
  };
}

export type EmailRenderer = ReturnType<typeof createEmailRenderer>;
