import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateToken = (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
    req.user = verified; // Attach user payload (id, email) to request
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid or expired token." });
  }
};