import { integer, pgTable, text } from "drizzle-orm/pg-core";

export const todos = pgTable("todos", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: text().notNull(),
  body: text().notNull(),
});
