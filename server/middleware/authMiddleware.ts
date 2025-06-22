// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';

// export async function authenticate(
//   req: Request, 
//   res: Response, 
//   next: NextFunction
// ): Promise<any> {
//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) return res.status(401).json({ message: 'No token provided' });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
//     req.user = { id: decoded.id };
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: 'Invalid token' });
//   }
// }

// middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.model';

interface JwtPayload {
  id: string;
}

export async function authenticate(
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<any> {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' }).end();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    
    const user = await User.findById(decoded.id)
      .select('id name email')
      .lean();
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' }).end();
    }

    req.user = {
      id: user._id.toString(), 
      name: user.name,
      email: user.email
    };
    
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' }).end();
  }
}