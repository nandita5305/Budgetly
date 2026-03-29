import { z } from 'zod';

export const expenseSchema = z.object({
  amount: z.number().positive("Amount must be greater than 0"),
  category: z.enum(["Food", "Rent", "Shopping", "Transport", "Bills", "Others"]),
  description: z.string().max(255).optional(),
  createdAt: z.string().datetime().optional(), // Validates ISO date strings
});