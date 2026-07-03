import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import {
  createClient,
  getClients,
  getClient,
  updateClient,
  deleteClient,
} from '../controllers/clientController';

const router = Router();

router.post('/', authMiddleware, asyncHandler(createClient));
router.get('/', authMiddleware, asyncHandler(getClients));
router.get('/:id', authMiddleware, asyncHandler(getClient));
router.put('/:id', authMiddleware, asyncHandler(updateClient));
router.delete('/:id', authMiddleware, asyncHandler(deleteClient));

export default router;
