import { Response } from 'express';
import prisma from '../config/database';
import { hashPassword } from '../utils/password';
import { validateBody, userUpdateSchema } from '../utils/validation';
import {
  AuthRequest,
  ForbiddenError,
  UnauthorizedError,
  UserNotFoundError,
  ValidationError,
  userSelect,
} from '../types';

function getParamId(req: AuthRequest): string {
  const id = req.params.id;
  if (typeof id !== 'string') {
    throw new UserNotFoundError();
  }
  return id;
}

async function getCurrentUser(req: AuthRequest) {
  if (!req.userId) {
    throw new UnauthorizedError();
  }

  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: userSelect,
  });

  if (!user) {
    throw new UnauthorizedError();
  }

  return user;
}

export async function getUsers(_req: AuthRequest, res: Response): Promise<void> {
  const users = await prisma.user.findMany({
    select: userSelect,
    orderBy: { createdAt: 'desc' },
  });

  res.json({ success: true, data: { users } });
}

export async function getUserById(req: AuthRequest, res: Response): Promise<void> {
  const id = getParamId(req);
  const currentUser = await getCurrentUser(req);

  if (currentUser.id !== id && currentUser.role !== 'admin') {
    throw new ForbiddenError();
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: userSelect,
  });

  if (!user) {
    throw new UserNotFoundError();
  }

  res.json({ success: true, data: { user } });
}

export async function updateUser(req: AuthRequest, res: Response): Promise<void> {
  const id = getParamId(req);
  const currentUser = await getCurrentUser(req);
  const data = validateBody(userUpdateSchema, req.body);

  if (currentUser.id !== id && currentUser.role !== 'admin') {
    throw new ForbiddenError();
  }

  if (data.role !== undefined && currentUser.role !== 'admin') {
    throw new ForbiddenError('Only admins can change user roles');
  }

  const existingUser = await prisma.user.findUnique({ where: { id } });

  if (!existingUser) {
    throw new UserNotFoundError();
  }

  if (data.email && data.email !== existingUser.email) {
    const emailTaken = await prisma.user.findUnique({ where: { email: data.email } });
    if (emailTaken) {
      throw new ValidationError('Email already in use');
    }
  }

  const updateData: { email?: string; password?: string; role?: string } = {};

  if (data.email !== undefined) {
    updateData.email = data.email;
  }

  if (data.password !== undefined) {
    updateData.password = await hashPassword(data.password);
  }

  if (data.role !== undefined) {
    updateData.role = data.role;
  }

  const user = await prisma.user.update({
    where: { id },
    data: updateData,
    select: userSelect,
  });

  res.json({ success: true, data: { user } });
}

export async function deleteUser(req: AuthRequest, res: Response): Promise<void> {
  const id = getParamId(req);
  const currentUser = await getCurrentUser(req);

  if (currentUser.id !== id && currentUser.role !== 'admin') {
    throw new ForbiddenError();
  }

  const existingUser = await prisma.user.findUnique({ where: { id } });

  if (!existingUser) {
    throw new UserNotFoundError();
  }

  await prisma.user.delete({ where: { id } });

  res.json({ success: true, message: 'User deleted successfully' });
}
