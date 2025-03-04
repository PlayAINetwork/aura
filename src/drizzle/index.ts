import * as schema from "./schema";
import { PGlite } from "@electric-sql/pglite";
import { Pool } from "pg";
import path from "path";
import env from "../env";

const { drizzle } =
  env.NODE_ENV === "local"
    ? await import("drizzle-orm/pglite")
    : await import("drizzle-orm/node-postgres");

const dbDir = path.join(__dirname, "PGlite");

const client =
  env.NODE_ENV === "local"
    ? new PGlite(dbDir)
    : new Pool({
        connectionString: env.DATABASE_URL,
      });

// @ts-ignore
const db = drizzle({ client });

export default db;

export { schema };
