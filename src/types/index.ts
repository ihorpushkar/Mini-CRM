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

export interface SafeUser {
  id: string;
  email: string;
  role: UserRole;
}

export interface User extends SafeUser {
  password: string;
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
