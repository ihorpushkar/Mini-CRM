import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  createClient,
  getClients,
  getClient,
  updateClient,
  deleteClient,
} from '../controllers/clientController';

const router = Router();

router.post('/', authMiddleware, createClient);
router.get('/', authMiddleware, getClients);
router.get('/:id', getClient);
router.put('/:id', authMiddleware, updateClient);
router.delete('/:id', authMiddleware, deleteClient);

export default router;
