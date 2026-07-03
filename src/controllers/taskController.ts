import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest, NotFoundError, ForbiddenError } from '../types';
import { validateBody, taskSchema, taskUpdateSchema, TaskCreateInput, TaskUpdateInput } from '../utils/validation';

function getParamId(req: AuthRequest): string {
  const id = req.params.id;
  if (typeof id !== 'string') {
    throw new NotFoundError('Task not found');
  }
  return id;
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

  const { status, assignedTo } = req.query;

  const where: { status?: string; assignedTo?: string } = {};

  if (status === 'pending' || status === 'completed') {
    where.status = status;
  }

  if (typeof assignedTo === 'string') {
    where.assignedTo = assignedTo;
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
  if (!req.userId) {
    throw new ForbiddenError();
  }

  const id = getParamId(req);
  const data = validateBody<TaskUpdateInput>(taskUpdateSchema, req.body);

  const existingTask = await prisma.task.findUnique({
    where: { id },
  });

  if (!existingTask) {
    throw new NotFoundError('Task not found');
  }

  const task = await prisma.task.update({
    where: { id },
    data,
    include: {
      client: true,
      assignee: {
        select: { id: true, email: true, role: true },
      },
    },
  });

  res.json({ success: true, data: task });
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

  await prisma.task.delete({
    where: { id },
  });

  res.json({ success: true, message: 'Task deleted successfully' });
}
