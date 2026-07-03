import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from '../controllers/taskController';

const router = Router();

router.post('/', asyncHandler(authMiddleware), asyncHandler(createTask));
router.get('/', asyncHandler(authMiddleware), asyncHandler(getTasks));
router.put('/:id', asyncHandler(authMiddleware), asyncHandler(updateTask));
router.delete('/:id', asyncHandler(authMiddleware), asyncHandler(deleteTask));

export default router;
