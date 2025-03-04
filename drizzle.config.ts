import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/drizzle/schema.ts",
  out: "./src/drizzle/migration",
  dbCredentials: {
    url:
      process.env.NODE_ENV === "local"
        ? "./src/drizzle/PGlite"
        : process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
  ...(process.env.NODE_ENV === "local" ? { driver: "pglite" } : {}),
});
