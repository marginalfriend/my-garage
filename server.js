// server.js

import express, { json } from 'express';
const app = express();
import { category as _category, product as _product } from './prisma-client.js';

app.use(json());

// server.js

import router from './routes/auth.js';
import authenticateToken from './middleware/auth.js';

app.use('/auth', router);

// Protecting CRUD operations
app.post('/categories', authenticateToken, async (req, res) => {
	if (!req.user.roles.includes('ADMIN') && !req.user.roles.includes('SUPER_ADMIN')) {
		return res.sendStatus(403);
	}
	const { name, isActive } = req.body;
	const category = await _category.create({
		data: { name, isActive }
	});
	res.json(category);
});

// Category CRUD Operations
app.post('/categories', async (req, res) => {
	const { name, isActive } = req.body;
	const category = await _category.create({
		data: { name, isActive }
	});
	res.json(category);
});

app.get('/categories', async (req, res) => {
	const categories = await _category.findMany();
	res.json(categories);
});

app.get('/categories/:id', async (req, res) => {
	const { id } = req.params;
	const category = await _category.findUnique({
		where: { id }
	});
	res.json(category);
});

app.put('/categories/:id', async (req, res) => {
	const { id } = req.params;
	const { name, isActive } = req.body;
	const category = await _category.update({
		where: { id },
		data: { name, isActive }
	});
	res.json(category);
});

app.delete('/categories/:id', async (req, res) => {
	const { id } = req.params;
	await _category.delete({
		where: { id }
	});
	res.sendStatus(204);
});

// Product CRUD Operations
app.post('/products', async (req, res) => {
	const { name, price, description, image, isActive, categoryId } = req.body;
	const product = await _product.create({
		data: { name, price, description, image, isActive, categoryId }
	});
	res.json(product);
});

app.get('/products', async (req, res) => {
	const products = await _product.findMany();
	res.json(products);
});

app.get('/products/:id', async (req, res) => {
	const { id } = req.params;
	const product = await _product.findUnique({
		where: { id }
	});
	res.json(product);
});

app.put('/products/:id', async (req, res) => {
	const { id } = req.params;
	const { name, price, description, image, isActive, categoryId } = req.body;
	const product = await _product.update({
		where: { id },
		data: { name, price, description, image, isActive, categoryId }
	});
	res.json(product);
});

app.delete('/products/:id', async (req, res) => {
	const { id } = req.params;
	await _product.delete({
		where: { id }
	});
	res.sendStatus(204);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
