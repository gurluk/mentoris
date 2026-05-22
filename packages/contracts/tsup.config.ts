import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  dts: {
    compilerOptions: {
      ignoreDeprecations: "6.0",
    },
  },
});
