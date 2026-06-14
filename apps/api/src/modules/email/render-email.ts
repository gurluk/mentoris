import fs from "fs";
import Handlebars from "handlebars";
import path from "path";
import { fileURLToPath } from "url";

type EmailTemplateVariables = {
  otp: {
    otp: string;
  };
};

type EmailTemplateName = keyof EmailTemplateVariables;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templatesDir = path.join(__dirname, "templates");

const templates = new Map<
  EmailTemplateName,
  Handlebars.TemplateDelegate<Record<string, unknown>>
>();

for (const file of fs.readdirSync(templatesDir)) {
  if (!file.endsWith(".hbs")) continue;
  const templateName = path.basename(file, ".hbs") as EmailTemplateName;
  const source = fs.readFileSync(path.join(templatesDir, file), "utf8");
  templates.set(templateName, Handlebars.compile(source));
}

export function renderEmail<T extends EmailTemplateName>(
  templateName: T,
  variables: EmailTemplateVariables[T],
) {
  const template = templates.get(templateName);

  console.log(template);

  if (!template) {
    throw new Error(`Email template not found: ${templateName}`);
  }

  return template({
    year: new Date().getFullYear(),
    ...variables,
  });
}
