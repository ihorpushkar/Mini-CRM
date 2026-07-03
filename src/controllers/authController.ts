import { Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { hashPassword, comparePassword } from '../utils/password';
import { AuthRequest, ConflictError, UserNotFoundError, UnauthorizedError, ValidationError, userSelect } from '../types';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

function issueTokens(userId: string) {
  return {
    token: generateAccessToken(userId),
    refreshToken: generateRefreshToken(userId),
  };
}

export async function register(req: AuthRequest, res: Response): Promise<void> {
  const parsed = registerSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ValidationError(parsed.error.issues[0]?.message ?? 'Invalid input');
  }

  const { email, password } = parsed.data;

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    throw new ConflictError('User with this email already exists');
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: { email, password: hashedPassword },
    select: userSelect,
  });

  const tokens = issueTokens(user.id);

  res.status(201).json({
    success: true,
    data: { user, ...tokens },
  });
}

export async function login(req: AuthRequest, res: Response): Promise<void> {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ValidationError(parsed.error.issues[0]?.message ?? 'Invalid input');
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, password: true },
  });

  if (!user) {
    throw new UnauthorizedError('Invalid credentials');
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid credentials');
  }

  const tokens = issueTokens(user.id);

  const safeUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: userSelect,
  });

  res.json({
    success: true,
    data: { user: safeUser, ...tokens },
  });
}

export async function refreshToken(req: AuthRequest, res: Response): Promise<void> {
  const parsed = refreshSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ValidationError(parsed.error.issues[0]?.message ?? 'Invalid input');
  }

  try {
    const { userId } = verifyRefreshToken(parsed.data.refreshToken);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: userSelect,
    });

    if (!user) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    res.json({
      success: true,
      data: issueTokens(userId),
    });
  } catch {
    throw new UnauthorizedError('Invalid or expired refresh token');
  }
}

export async function getProfile(req: AuthRequest, res: Response): Promise<void> {
  if (!req.userId) {
    throw new UnauthorizedError();
  }

  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: userSelect,
  });

  if (!user) {
    throw new UserNotFoundError();
  }

  res.json({ success: true, data: { user } });
}
