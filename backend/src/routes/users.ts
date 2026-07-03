import { Router } from 'express';
import { getUsers, getUserById, updateUser, deleteUser } from '../controllers/userController';
import { authMiddleware } from '../middleware/auth';
import { requireRole } from '../middleware/authorize';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

router.get('/', asyncHandler(authMiddleware), requireRole('admin'), asyncHandler(getUsers));
router.get('/:id', asyncHandler(authMiddleware), asyncHandler(getUserById));
router.put('/:id', asyncHandler(authMiddleware), asyncHandler(updateUser));
router.delete('/:id', asyncHandler(authMiddleware), asyncHandler(deleteUser));

export default router;
