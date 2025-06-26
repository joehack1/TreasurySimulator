import { pgTable, text, serial, integer, decimal, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  provider: text("provider").notNull(),
  currency: text("currency").notNull(),
  balance: decimal("balance", { precision: 15, scale: 2 }).notNull().default("0"),
  accountType: text("account_type").notNull(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  fromAccountId: text("from_account_id").notNull(),
  toAccountId: text("to_account_id").notNull(),
  fromAccountName: text("from_account_name").notNull(),
  toAccountName: text("to_account_name").notNull(),
  amountSent: decimal("amount_sent", { precision: 15, scale: 2 }).notNull(),
  amountReceived: decimal("amount_received", { precision: 15, scale: 2 }).notNull(),
  fromCurrency: text("from_currency").notNull(),
  toCurrency: text("to_currency").notNull(),
  exchangeRate: decimal("exchange_rate", { precision: 10, scale: 6 }),
  notes: text("notes"),
  status: text("status").notNull().default("completed"),
  transferDate: timestamp("transfer_date").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAccountSchema = createInsertSchema(accounts);
export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

export type Account = typeof accounts.$inferSelect;
export type InsertAccount = z.infer<typeof insertAccountSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
