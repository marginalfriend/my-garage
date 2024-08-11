import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import authRoutes from './server/routes/auth.js';
import categoryRoutes from './server/routes/categories.js';
import productRoutes from './server/routes/products.js';
import { errorHandler } from './server/middleware/errorHandler.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/auth', authRoutes);
app.use('/categories', categoryRoutes);
app.use('/products', productRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});