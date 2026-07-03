import { z } from 'zod';
import { ValidationError } from '../types';

export const userCreateSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'user']).default('user'),
});

export const userUpdateSchema = z
  .object({
    email: z.string().email('Invalid email address').optional(),
    password: z.string().min(6, 'Password must be at least 6 characters').optional(),
    role: z.enum(['admin', 'user']).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

export type UserCreateInput = z.infer<typeof userCreateSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;

export const clientSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
});

export const clientUpdateSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    email: z.string().email('Invalid email address').optional(),
    phone: z.string().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  clientId: z.string().min(1, 'Client ID is required'),
  status: z.enum(['pending', 'completed']).default('pending'),
});

export const taskUpdateSchema = z
  .object({
    title: z.string().min(1, 'Title is required').optional(),
    description: z.string().optional(),
    status: z.enum(['pending', 'completed']).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

export const taskQuerySchema = z.object({
  status: z.enum(['pending', 'completed']).optional(),
  assignedTo: z.string().min(1).optional(),
});

export const paramIdSchema = z.string().min(1, 'Invalid ID');

export type ClientCreateInput = z.infer<typeof clientSchema>;
export type ClientUpdateInput = z.infer<typeof clientUpdateSchema>;
export type TaskCreateInput = z.infer<typeof taskSchema>;
export type TaskUpdateInput = z.infer<typeof taskUpdateSchema>;

export function validateQuery<T>(schema: z.ZodSchema<T>, query: unknown): T {
  const parsed = schema.safeParse(query);

  if (!parsed.success) {
    throw new ValidationError(parsed.error.issues[0]?.message ?? 'Validation failed');
  }

  return parsed.data;
}

export function validateBody<T>(schema: z.ZodSchema<T>, body: unknown): T {
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    throw new ValidationError(parsed.error.issues[0]?.message ?? 'Validation failed');
  }

  return parsed.data;
}
