import { Response, NextFunction } from 'express';
import prisma from '../config/database';
import { AuthRequest, ForbiddenError, UnauthorizedError, UserRole } from '../types';

export function requireRole(...roles: UserRole[]) {
  return async (req: AuthRequest, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.userId) {
        throw new UnauthorizedError();
      }

      const user = await prisma.user.findUnique({
        where: { id: req.userId },
        select: { role: true },
      });

      if (!user) {
        throw new UnauthorizedError();
      }

      req.userRole = user.role as UserRole;

      if (!roles.includes(req.userRole)) {
        throw new ForbiddenError();
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}
