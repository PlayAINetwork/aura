import * as schema from "./schema";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import path from "path";

const dbDir = path.join(__dirname, "PGlite");

const client = new PGlite(dbDir);

const db = drizzle({ client });

export default db;

export { schema };
