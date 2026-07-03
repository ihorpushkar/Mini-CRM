import { Router } from 'express';
import { getUsers, getUserById, updateUser, deleteUser } from '../controllers/userController';
import { authMiddleware } from '../middleware/auth';
import { requireRole } from '../middleware/authorize';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

router.use(authMiddleware);

router.get('/', requireRole('admin'), asyncHandler(getUsers));
router.get('/:id', asyncHandler(getUserById));
router.put('/:id', asyncHandler(updateUser));
router.delete('/:id', requireRole('admin'), asyncHandler(deleteUser));

export default router;
