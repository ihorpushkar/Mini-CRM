import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest, NotFoundError, ForbiddenError } from '../types';
import { validateBody, validateQuery, taskSchema, taskUpdateSchema, taskQuerySchema, paramIdSchema, TaskCreateInput, TaskUpdateInput } from '../utils/validation';

function getParamId(req: AuthRequest): string {
  const parsed = paramIdSchema.safeParse(req.params.id);
  if (!parsed.success) {
    throw new NotFoundError('Task not found');
  }
  return parsed.data;
}

async function assertAdminOrAssignee(req: AuthRequest, assignedTo: string | null): Promise<void> {
  if (!req.userId) {
    throw new ForbiddenError();
  }

  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { role: true },
  });

  if (!user) {
    throw new ForbiddenError();
  }

  if (user.role !== 'admin' && assignedTo !== null && req.userId !== assignedTo) {
    throw new ForbiddenError();
  }
}

function canEditTask(role: string, userId: string, assignedTo: string | null): boolean {
  return role === 'admin' || assignedTo === userId || assignedTo === null;
}

export async function createTask(req: AuthRequest, res: Response): Promise<void> {
  if (!req.userId) {
    throw new ForbiddenError();
  }

  const data = validateBody<TaskCreateInput>(taskSchema, req.body);

  const client = await prisma.client.findUnique({
    where: { id: data.clientId },
  });

  if (!client) {
    throw new NotFoundError('Client not found');
  }

  const task = await prisma.task.create({
    data: {
      ...data,
      assignedTo: req.userId,
    },
    include: {
      client: true,
      assignee: {
        select: { id: true, email: true, role: true },
      },
    },
  });

  res.status(201).json({ success: true, data: task });
}

export async function getTasks(req: AuthRequest, res: Response): Promise<void> {
  if (!req.userId) {
    throw new ForbiddenError();
  }

  const query = validateQuery(taskQuerySchema, req.query);

  const currentUser = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { role: true },
  });

  if (!currentUser) {
    throw new ForbiddenError();
  }

  const where: {
    status?: string;
    assignedTo?: string;
    OR?: Array<{ assignedTo: string | null }>;
  } = {};

  if (query.status) {
    where.status = query.status;
  }

  if (query.assignedTo) {
    where.assignedTo = query.assignedTo;
  } else if (currentUser.role !== 'admin') {
    where.OR = [
      { assignedTo: req.userId },
      { assignedTo: null },
    ];
  }

  const tasks = await prisma.task.findMany({
    where,
    include: {
      client: true,
      assignee: {
        select: { id: true, email: true, role: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json({ success: true, data: tasks });
}

export async function updateTask(req: AuthRequest, res: Response): Promise<void> {
  const id = getParamId(req);
  const user = req.user;

  console.log('updateTask - user:', user);
  console.log('updateTask - id:', id);

  if (!user) {
    res.status(401).json({ success: false, error: 'Unauthorized' });
    return;
  }

  const data = validateBody<TaskUpdateInput>(taskUpdateSchema, req.body);

  const task = await prisma.task.findUnique({ where: { id } });
  console.log('updateTask - task:', task);

  if (!task) {
    throw new NotFoundError('Task not found');
  }

  const canEdit =
    user.role === 'admin' ||
    task.assignedTo === user.userId ||
    task.assignedTo === null;

  console.log('canEdit:', canEdit);

  if (!canEdit) {
    res.status(403).json({
      success: false,
      error: 'Forbidden',
      debug: { role: user.role, assignedTo: task.assignedTo, userId: user.userId },
    });
    return;
  }

  const updated = await prisma.task.update({
    where: { id },
    data,
    include: {
      client: true,
      assignee: {
        select: { id: true, email: true, role: true },
      },
    },
  });

  res.json({ success: true, data: updated });
}

export async function deleteTask(req: AuthRequest, res: Response): Promise<void> {
  if (!req.userId) {
    throw new ForbiddenError();
  }

  const id = getParamId(req);

  const task = await prisma.task.findUnique({
    where: { id },
  });

  if (!task) {
    throw new NotFoundError('Task not found');
  }

  await assertAdminOrAssignee(req, task.assignedTo);

  await prisma.task.delete({
    where: { id },
  });

  res.json({ success: true, message: 'Task deleted successfully' });
}
