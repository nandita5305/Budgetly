import { Router } from 'express';
import { db } from '../db';
import { users, expenses } from '../db/schema';
import { eq, and, gte } from 'drizzle-orm';
import { linearRegression } from 'simple-statistics';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user.id;

    // 1. Fetch User First (Drizzle returns array, use [0])
    const userRecords = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    const user = userRecords[0];

    if (!user) return res.status(404).json({ error: "User not found" });

    // 2. Fetch Monthly Expenses
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const history = await db.select().from(expenses)
      .where(and(eq(expenses.userId, userId), gte(expenses.createdAt, startOfMonth)))
      .orderBy(expenses.createdAt);

    const userLimit = user.monthlyLimit || 10000;
    const currentTotal = history.reduce((sum, exp) => sum + exp.amount, 0);

    // 3. BASE RESPONSE (This ensures Name/Email visibility always)
    let responseData = {
      user: {
        name: user.name,
        email: user.email
      },
      limit: userLimit,
      currentTotal: currentTotal,
      predictedTotal: currentTotal,
      dailyBurnRate: "0.00",
      isOver: currentTotal > userLimit,
      breakdown: {} as Record<string, number>,
      topExpense: {
        category: "N/A",
        amount: 0,
        percentage: "0%"
      }
    };

    // 4. ADD ANALYTICS (If 2 or more data points exist)
    if (history.length >= 2) {
      const categoryTotals: Record<string, number> = {};
      let runningTotal = 0;

      const regressionPoints = history.map((exp) => {
        runningTotal += exp.amount;
        categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
        return [new Date(exp.createdAt!).getDate(), runningTotal];
      });

      const { m, b } = linearRegression(regressionPoints);
      const prediction = Math.round(m * 30 + b);

      const topCat = Object.keys(categoryTotals).reduce((a, b) => 
        categoryTotals[a] > categoryTotals[b] ? a : b
      );

      responseData.predictedTotal = prediction;
      responseData.dailyBurnRate = m.toFixed(2);
      responseData.isOver = prediction > userLimit;
      responseData.breakdown = categoryTotals;
      responseData.topExpense = {
        category: topCat,
        amount: categoryTotals[topCat],
        percentage: ((categoryTotals[topCat] / currentTotal) * 100).toFixed(1) + "%"
      };
    }

    return res.json(responseData);

  } catch (error) {
    console.error("Analysis Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;