import { Router } from 'express';
import authRoutes from './auth';
import userRoutes from './users';
import clientRoutes from './clients';
import taskRoutes from './tasks';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'Mini CRM API is running' });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/clients', clientRoutes);
router.use('/tasks', taskRoutes);

router.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

export default router;
