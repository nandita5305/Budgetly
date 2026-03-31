import { Router } from 'express';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// GET: Current User Profile
router.get('/me', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user.id;
    
    // Drizzle returns an array, so we must use [0]
    const userRecords = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      monthlyLimit: users.monthlyLimit
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

    if (!userRecords.length) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(userRecords[0]);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;