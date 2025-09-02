import { Router } from 'express';
import { createRecord, deleteRecord } from '../controllers/newsletterEmailController';
import { Authorize } from '../middleware/authMiddleware';

const router = Router();
router.post('/', createRecord);
router.delete('/:id', Authorize, deleteRecord);

export const newsletterEmailRoutes = router;