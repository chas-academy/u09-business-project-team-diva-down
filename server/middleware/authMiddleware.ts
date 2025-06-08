import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export async function authenticate(
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<any> {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
