import express, { Request } from 'express';
import { db } from '../db';
import { expenses, users } from '../db/schema';
import { eq, and, gte } from 'drizzle-orm';
import { linearRegression } from 'simple-statistics';
import { authenticateToken } from '../middleware/auth';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

const router = express.Router();

// src/routes/analysis.ts

router.get('/', authenticateToken, async (req: any, res) => {
  const userId = req.user.id;
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const history = await db.select().from(expenses)
    .where(and(eq(expenses.userId, userId), gte(expenses.createdAt, startOfMonth)))
    .orderBy(expenses.createdAt);

  if (history.length < 2) return res.json({ message: "Not enough data" });

  // 1. Group by Category
  const categoryTotals: Record<string, number> = {};
  let runningTotal = 0;

  const regressionPoints = history.map((exp) => {
    runningTotal += exp.amount;
    // Track category spending
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    
    return [new Date(exp.createdAt!).getDate(), runningTotal];
  });

  // 2. Calculate Linear Regression
  const { m, b } = linearRegression(regressionPoints);
  const prediction = Math.round(m * 30 + b);

  // 3. Find the "Budget Killer" (Top Category)
  const topCategory = Object.keys(categoryTotals).reduce((a, b) => 
    categoryTotals[a] > categoryTotals[b] ? a : b
  );

  res.json({
    currentTotal: runningTotal,
    predictedTotal: prediction,
    dailyBurnRate: m.toFixed(2),
    isOver: prediction > 10000,
    breakdown: categoryTotals,
    topExpense: {
      category: topCategory,
      amount: categoryTotals[topCategory],
      percentage: ((categoryTotals[topCategory] / runningTotal) * 100).toFixed(1) + "%"
    }
  });
});
export default router;