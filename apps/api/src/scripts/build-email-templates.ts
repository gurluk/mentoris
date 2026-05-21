import fs from "fs";
import mjml2html from "mjml";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, "..", "modules", "email", "mjml");
const outDir = path.join(__dirname, "..", "modules", "email", "templates");

// Ensure output directory exists
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Compile each MJML file
for (const file of fs.readdirSync(srcDir)) {
  if (file.endsWith(".mjml")) {
    const filePath = path.join(srcDir, file);
    const mjmlContent = fs.readFileSync(filePath, "utf-8");

    const { html, errors } = await mjml2html(mjmlContent, { filePath });

    if (errors.length) {
      process.stderr.write(
        `MJML errors in ${file}: ${JSON.stringify(errors, null, 2)}\n`,
      );
    }

    const outFile = file.replace(".mjml", ".hbs");
    fs.writeFileSync(path.join(outDir, outFile), html, "utf-8");
  }
}

process.stdout.write(`Email templates built into: ${outDir}\n`);
