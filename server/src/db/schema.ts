import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const chats = pgTable("chats", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  chatbar_id: text().notNull(),
  email: text().notNull(),
  role: text().notNull(),
  text: text().notNull(),
  created_at: timestamp().notNull().defaultNow(),
});
export const chatbarchats = pgTable("chatbarchats", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  folder_id: text().notNull(),
  chat_name: text().notNull(),
  email: text().notNull(),
  created_at: timestamp().notNull().defaultNow(),
});
export const folders = pgTable("folders", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  folder_name: text().notNull(),
  email: text().notNull(),
  created_at: timestamp().notNull().defaultNow(),
});
