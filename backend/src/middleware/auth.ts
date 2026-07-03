import { Response, NextFunction } from 'express';
import prisma from '../config/database';
import { AuthRequest, UserRole } from '../types';
import { verifyToken } from '../utils/jwt';

export async function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: 'Access token required', message: 'Access token required' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const { userId } = verifyToken(token);

    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });

    if (!dbUser) {
      res.status(401).json({ success: false, error: 'Invalid or expired token', message: 'Invalid or expired token' });
      return;
    }

    req.userId = userId;
    req.userRole = dbUser.role as UserRole;
    req.user = { userId: dbUser.id, role: dbUser.role as UserRole };

    console.log('Auth middleware:', req.user);

    next();
  } catch {
    res.status(401).json({ success: false, error: 'Invalid or expired token', message: 'Invalid or expired token' });
  }
}
