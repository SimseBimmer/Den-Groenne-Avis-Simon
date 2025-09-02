import { Router } from 'express';
import { createRecord, deleteRecord, getRecords } from '../controllers/commentController';
import { Authorize } from '../middleware/authMiddleware';

const routes = Router();
routes.get('/:productId', getRecords);
routes.post('/', Authorize, createRecord);
routes.delete('/:id', Authorize, deleteRecord);

export const commentRoutes = routes;
