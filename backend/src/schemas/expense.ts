import { z } from 'zod';

export const expenseSchema = z.object({
  amount: z.number().positive(), // If you send a string "10", this FAILS
  category: z.string().min(1),
  description: z.string().optional(),
  createdAt: z.string().pipe(z.coerce.date()) // This helps convert strings to Dates
});