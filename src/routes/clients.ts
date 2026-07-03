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

router.use(authMiddleware);

router.post('/', asyncHandler(createClient));
router.get('/', asyncHandler(getClients));
router.get('/:id', asyncHandler(getClient));
router.put('/:id', asyncHandler(updateClient));
router.delete('/:id', asyncHandler(deleteClient));

export default router;
