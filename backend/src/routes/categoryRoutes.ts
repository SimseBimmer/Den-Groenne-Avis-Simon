import { Router } from 'express';
import { getRecord, getRecords } from '../controllers/categoryController';

const routes = Router();
routes.get('/', getRecords);
routes.get('/:id', getRecord);

export const categoryRoutes = routes;
