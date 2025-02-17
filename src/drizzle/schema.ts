import { json, pgTable, uuid } from "drizzle-orm/pg-core";

export const service = pgTable("service", {
  id: uuid("id").primaryKey().defaultRandom(),
  data: json("data").notNull(),
});
