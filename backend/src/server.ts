import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from './db';
import { expenses, users } from './db/schema';
import { eq, sql } from 'drizzle-orm';
import { linearRegression } from 'simple-statistics';
import { authenticateToken } from './middleware/auth';

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

app.use(cors());
app.use(express.json());

// --- AUTH ROUTES ---

// Registration
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
    const newUser = await db.insert(users).values({ 
      name, email, password: hashedPassword 
    }).returning();
    res.status(201).json({ message: "User created", userId: newUser[0].id });
  } catch (e) {
    res.status(400).json({ error: "User already exists" });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const userRecord = await db.select().from(users).where(eq(users.email, email));
  
  if (userRecord.length === 0) return res.status(404).json({ error: "User not found" });

  const validPassword = await bcrypt.compare(password, userRecord[0].password);
  if (!validPassword) return res.status(401).json({ error: "Invalid password" });

  const token = jwt.sign({ id: userRecord[0].id, email: userRecord[0].email }, JWT_SECRET);
  res.json({ token });
});

// --- PROTECTED ROUTES ---

// Log an Expense (Protected)
app.post('/api/expenses', authenticateToken, async (req: any, res) => {
  const { amount, category, description } = req.body;
  const newExpense = await db.insert(expenses).values({
    userId: req.user.id, 
    amount, 
    category, 
    description
  }).returning();
  res.json(newExpense);
});

// The Predictor Endpoint (Protected)
app.get('/api/analysis', authenticateToken, async (req: any, res) => {
  const userId = req.user.id;

  // Get User's limit and history
  const [userData] = await db.select().from(users).where(eq(users.id, userId));
  const history = await db.select().from(expenses)
    .where(eq(expenses.userId, userId))
    .orderBy(expenses.createdAt);

  if (history.length < 2) {
    return res.json({ message: "Need more data points", prediction: null });
  }

  let runningTotal = 0;
  const regressionPoints = history.map((exp) => {
    const day = new Date(exp.createdAt!).getDate();
    runningTotal += exp.amount;
    return [day, runningTotal];
  });

  const line = linearRegression(regressionPoints);
  const predictionEOM = line.m * 30 + line.b;

  res.json({
    currentTotal: runningTotal,
    predictedTotal: Math.round(predictionEOM),
    isOverBudget: predictionEOM > (userData?.monthlyLimit || 10000),
    limit: userData?.monthlyLimit
  });
});

app.listen(3001, () => console.log('🚀 Secure Budget Server running on port 3001'));