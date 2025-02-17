import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/drizzle/schema.ts",
  out: "./src/drizzle/migration",
  driver: "pglite",
  dbCredentials: {
    url: "./src/drizzle/PGlite",
  },
  verbose: true,
  strict: true,
});
