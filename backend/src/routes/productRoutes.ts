import { Router } from 'express';
import { createRecord, getRecord, getRecords, getRecordsFromCategory } from '../controllers/productController';
import { Authorize } from '../middleware/authMiddleware';
import { updateRecord } from '../controllers/productController';
import { deleteRecord } from '../controllers/productController';

const routes = Router();
routes.get('/', getRecords);
routes.get('/:slug', getRecord);
routes.get('/category/:slug', getRecordsFromCategory);
routes.post('/', Authorize, createRecord);
routes.put('/:id', Authorize, updateRecord);
routes.delete('/:id', Authorize, deleteRecord);

export const productRoutes = routes;
