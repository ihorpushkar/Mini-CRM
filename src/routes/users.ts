import { Router } from 'express';
import { getUsers, getUserById, updateUser, deleteUser } from '../controllers/userController';
import { authMiddleware } from '../middleware/auth';
import { requireRole } from '../middleware/authorize';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

router.get('/', authMiddleware, requireRole('admin'), asyncHandler(getUsers));
router.get('/:id', authMiddleware, asyncHandler(getUserById));
router.put('/:id', authMiddleware, asyncHandler(updateUser));
router.delete('/:id', authMiddleware, asyncHandler(deleteUser));

export default router;
