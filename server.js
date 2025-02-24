import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import authRoutes from './server/routes/authRoutes.js';
import categoryRoutes from './server/routes/categoriesRoutes.js';
import productRoutes from './server/routes/productsRoutes.js';
import cartRoutes from './server/routes/cartRoutes.js';
import orderRoutes from './server/routes/orderRoutes.js';
import { errorHandler } from './server/middleware/errorHandler.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use('/uploads', (req, res, next) => {
	console.log('Requested file:', req.url);
	console.log('Full path:', path.join(__dirname, 'uploads', req.url));
	next();
}, express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/auth', authRoutes);
app.use('/categories', categoryRoutes);
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});