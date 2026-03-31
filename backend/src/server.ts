import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import authRoutes from './routes/auth';
import { authenticateToken } from './middleware/auth';
import { db } from './db';
import { expenses, users } from './db/schema';
import { eq, and, gte } from 'drizzle-orm';
import { linearRegression } from 'simple-statistics';
import { expenseSchema } from './schemas/expense';
import { sql } from 'drizzle-orm';

const app = express();
app.use(cors());
app.use(express.json());

// Public Routes
app.use('/api/auth', authRoutes);

// Protected Expense Logging


app.post('/api/expenses', authenticateToken, async (req: any, res) => {
  // 1. Validate Input
  const result = expenseSchema.safeParse(req.body);
  
  if (!result.success) {
    return res.status(400).json({ 
      error: "Validation Failed", 
      details: result.error.format() 
    });
  }

  // 2. If valid, proceed to DB
  const { amount, category, description, createdAt } = result.data;
  
  try {
    const newExp = await db.insert(expenses).values({
      userId: req.user.id,
      amount,
      category,
      description,
      createdAt: createdAt ? new Date(createdAt) : new Date()
    }).returning();
    
    res.json(newExp);
  } catch (e) {
    res.status(500).json({ error: "Database error" });
  }
});

// Protected Analysis
app.get('/api/analysis', authenticateToken, async (req: any, res) => {
  const userId = req.user.id;
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  // 1. Fetch data
  const [user] = await db.select().from(users).where(eq(users.id, userId));
  const history = await db.select().from(expenses)
    .where(and(eq(expenses.userId, userId), gte(expenses.createdAt, startOfMonth)))
    .orderBy(expenses.createdAt);

  if (history.length < 2) return res.json({ message: "Not enough data" });

  // 2. Logic: Totals & Categories
  const categoryTotals: Record<string, number> = {};
  let currentTotal = 0;

  const points = history.map((exp) => {
    currentTotal += exp.amount;
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    return [new Date(exp.createdAt!).getDate(), currentTotal];
  });

  // 3. Math: Prediction
  const { m, b } = linearRegression(points);
  const prediction = Math.round(m * 30 + b);
  const limit = user?.monthlyLimit || 10000;

  // 4. Find Top Category
  const topCat = Object.keys(categoryTotals).reduce((a, b) => 
    categoryTotals[a] > categoryTotals[b] ? a : b
  );

  // 5. SEND UPDATED RESPONSE
  res.json({
    currentTotal,
    predictedTotal: prediction,
    limit,
    isOver: prediction > limit,
    dailyBurnRate: m.toFixed(2),
    breakdown: categoryTotals,
    topExpense: {
      category: topCat,
      amount: categoryTotals[topCat],
      percentage: ((categoryTotals[topCat] / currentTotal) * 100).toFixed(1) + "%"
    }
  });
});

// GET All Expenses for the User (Protected)
app.get('/api/expenses', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user.id;
    
    // Fetch expenses ordered by newest first
    const userExpenses = await db.select()
      .from(expenses)
      .where(eq(expenses.userId, userId))
      .orderBy(sql`${expenses.createdAt} DESC`);

    // IMPORTANT: Return the array directly so the frontend can `.map()` it
    res.json(userExpenses); 
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

app.listen(3001, () => console.log('🚀 Server running on port 3001'));