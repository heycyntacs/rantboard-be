import { text } from "drizzle-orm/pg-core";
import { integer, pgTable, timestamp } from "drizzle-orm/pg-core";

export const rantsTable = pgTable("rants", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  created_at: timestamp(),
  title: text(),
  content: text(),
});
