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

router.post('/', asyncHandler(authMiddleware), asyncHandler(createClient));
router.get('/', asyncHandler(authMiddleware), asyncHandler(getClients));
router.get('/:id', asyncHandler(authMiddleware), asyncHandler(getClient));
router.put('/:id', asyncHandler(authMiddleware), asyncHandler(updateClient));
router.delete('/:id', asyncHandler(authMiddleware), asyncHandler(deleteClient));

export default router;
