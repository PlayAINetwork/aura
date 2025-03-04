import { json, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const service = pgTable("service", {
  id: uuid("id").primaryKey().defaultRandom(),
  data: json("data").notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const tweet = pgTable("tweet", {
  id: varchar("id", {
    length: 255,
  }).primaryKey(),
  serviceId: uuid("service_id")
    .notNull()
    .references(() => service.id),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
});
