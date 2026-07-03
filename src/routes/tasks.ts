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

router.post('/', authMiddleware, asyncHandler(createTask));
router.get('/', authMiddleware, asyncHandler(getTasks));
router.put('/:id', authMiddleware, asyncHandler(updateTask));
router.delete('/:id', authMiddleware, asyncHandler(deleteTask));

export default router;
