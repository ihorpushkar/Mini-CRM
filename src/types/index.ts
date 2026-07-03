import { Request } from 'express';

export {
  AppError,
  NotFoundError,
  UserNotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ValidationError,
  ConflictError,
} from '../utils/errors';

export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: UserRole;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

export const userSelect = {
  id: true,
  email: true,
  role: true,
} as const;
