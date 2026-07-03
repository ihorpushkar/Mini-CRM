import { Router } from 'express';
import { register, login, refreshToken, getProfile } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';
import { authRateLimiter } from '../middleware/rateLimiter';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

router.post('/register', authRateLimiter, asyncHandler(register));
router.post('/login', authRateLimiter, asyncHandler(login));
router.post('/refresh', authRateLimiter, asyncHandler(refreshToken));
router.get('/profile', authMiddleware, asyncHandler(getProfile));
router.get('/me', authMiddleware, asyncHandler(getProfile));

export default router;
