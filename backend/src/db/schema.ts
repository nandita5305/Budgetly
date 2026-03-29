import { pgTable, serial, text, integer, timestamp, doublePrecision } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  monthlyLimit: integer('monthly_limit').default(10000),
});

export const expenses = pgTable('expenses', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  amount: doublePrecision('amount').notNull(),
  category: text('category').notNull(), // Food, Rent, etc.
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
});