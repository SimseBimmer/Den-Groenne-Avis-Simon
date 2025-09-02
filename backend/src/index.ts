import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { userRoutes } from './routes/userRoutes';
import { productRoutes } from './routes/productRoutes';
import { authRoutes } from './routes/authRoutes';
import { categoryRoutes } from './routes/categoryRoutes';
import { commentRoutes } from './routes/commentRoutes';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import { newsletterEmailRoutes } from './routes/newsletterEmailRoutes';

dotenv.config();
const port = process.env.SERVERPORT || 3000

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use('/assets', express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/newsletters', newsletterEmailRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});