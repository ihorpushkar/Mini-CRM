import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest, NotFoundError, ForbiddenError } from '../types';
import { validateBody, clientSchema, clientUpdateSchema, ClientCreateInput, ClientUpdateInput } from '../utils/validation';

function getParamId(req: AuthRequest): string {
  const id = req.params.id;
  if (typeof id !== 'string') {
    throw new NotFoundError('Client not found');
  }
  return id;
}

export async function createClient(req: AuthRequest, res: Response): Promise<void> {
  if (!req.userId) {
    throw new ForbiddenError();
  }

  const data = validateBody<ClientCreateInput>(clientSchema, req.body);

  const client = await prisma.client.create({
    data: {
      ...data,
      createdBy: req.userId,
    },
  });

  res.status(201).json({ success: true, data: client });
}

export async function getClients(req: AuthRequest, res: Response): Promise<void> {
  if (!req.userId) {
    throw new ForbiddenError();
  }

  const clients = await prisma.client.findMany({
    include: {
      creator: {
        select: { id: true, email: true, role: true },
      },
      tasks: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json({ success: true, data: clients });
}

export async function getClient(req: AuthRequest, res: Response): Promise<void> {
  const id = getParamId(req);

  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      creator: {
        select: { id: true, email: true, role: true },
      },
      tasks: {
        include: {
          assignee: {
            select: { id: true, email: true, role: true },
          },
        },
      },
    },
  });

  if (!client) {
    throw new NotFoundError('Client not found');
  }

  res.json({ success: true, data: client });
}

export async function updateClient(req: AuthRequest, res: Response): Promise<void> {
  if (!req.userId) {
    throw new ForbiddenError();
  }

  const id = getParamId(req);
  const data = validateBody<ClientUpdateInput>(clientUpdateSchema, req.body);

  const existingClient = await prisma.client.findUnique({
    where: { id },
    select: { createdBy: true },
  });

  if (!existingClient) {
    throw new NotFoundError('Client not found');
  }

  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { role: true },
  });

  if (!user) {
    throw new ForbiddenError();
  }

  if (existingClient.createdBy !== req.userId && user.role !== 'admin') {
    throw new ForbiddenError();
  }

  const client = await prisma.client.update({
    where: { id },
    data,
  });

  res.json({ success: true, data: client });
}

export async function deleteClient(req: AuthRequest, res: Response): Promise<void> {
  if (!req.userId) {
    throw new ForbiddenError();
  }

  const id = getParamId(req);

  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { role: true },
  });

  if (!user || user.role !== 'admin') {
    throw new ForbiddenError();
  }

  const client = await prisma.client.findUnique({
    where: { id },
  });

  if (!client) {
    throw new NotFoundError('Client not found');
  }

  await prisma.client.delete({
    where: { id },
  });

  res.json({ success: true, message: 'Client deleted successfully' });
}
