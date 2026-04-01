import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { sql, eq, and, gte } from 'drizzle-orm';

// Route Imports
import authRoutes from './routes/auth';
import analysisRoutes from './routes/analysis';
import userRoutes from './routes/user';
import { authenticateToken } from './middleware/auth';
import { db } from './db';
import { expenses, users } from './db/schema';
import { expenseSchema } from './schemas/expense';

const app = express();
app.use(cors());
app.use(express.json());

// --- 1. ROUTE REGISTRATION ---
app.use('/api/auth', authRoutes);     // Public: Login/Register
app.use('/api/user', userRoutes);     // Protected: Identity (Name, Email)
app.use('/api/analysis', analysisRoutes); // Protected: Dashboard Math

// --- 2. EXPENSE LOGGING (POST) ---
app.post('/api/expenses', authenticateToken, async (req: any, res) => {
  const result = expenseSchema.safeParse(req.body);
  
  if (!result.success) {
    return res.status(400).json({ 
      error: "Validation Failed", 
      details: result.error.format() 
    });
  }

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

// --- 3. GET ALL EXPENSES (GET) ---
app.get('/api/expenses', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user.id;
    
    const userExpenses = await db.select()
      .from(expenses)
      .where(eq(expenses.userId, userId))
      .orderBy(sql`${expenses.createdAt} DESC`);

    res.json(userExpenses); 
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

// --- 4. DELETE EXPENSE (DELETE) ---
app.delete('/api/expenses/:id', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const expenseId = parseInt(req.params.id, 10);

    const result = await db.delete(expenses)
      .where(and(
        eq(expenses.id, expenseId),
        eq(expenses.userId, userId)
      ))
      .returning();

    if (result.length === 0) {
      return res.status(404).json({ error: "Transaction not found or unauthorized" });
    }

    res.json({ message: "Transaction deleted successfully", deleted: result[0] });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// --- 5. UPDATE BUDGET & PROFILE (PUT) ---
app.put('/api/update-budget', authenticateToken, async (req: any, res) => {
  const userId = req.user.id;
  const { name, budgetLimit } = req.body;

  try {
    await db.update(users)
      .set({ 
        name: name,
        monthlyLimit: Number(budgetLimit) 
      })
      .where(eq(users.id, userId));

    res.json({ success: true, message: "Engine Preferences Synchronized" });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ error: "Failed to update configuration" });
  }
});

app.listen(3001, () => console.log('🚀 Server running on port 3001'));