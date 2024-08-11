import express, { json } from 'express';
import { category as _category, product as _product } from './prisma-client.js';
import authenticateToken from './server/middleware/auth.js';
import router from './server/routes/auth.js';
import upload from './server/upload.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { prisma } from './prisma-client.js';

const app = express();
app.use(json());
app.use('/auth', router);
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
	try {
		const { query } = req.query;

		// If a query string is provided, filter categories by name
		let categories;
		if (query) {
			categories = await _category.findMany({
				where: {
					name: {
						contains: query,
						mode: 'insensitive', // case-insensitive search
					},
				},
			});
		} else {
			// If no query string is provided, return all categories
			categories = await _category.findMany();
		}

		res.json(categories);
	} catch (error) {
		console.error('Error fetching categories:', error);
		res.status(500).json({ message: 'Server error' });
	}
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

// CRUD operations for Product

// Create Product
app.post('/products', authenticateToken, (req, res) => {
	if (!req.user.roles.includes('ADMIN') && !req.user.roles.includes('SUPER_ADMIN')) {
		return res.sendStatus(403);
	}

	upload(req, res, async (err) => {
		if (err) {
			return res.status(400).json({ message: err });
		}

		const { categoryId, name, price, description, stock } = req.body;

		const imageUrls = req.files.map(file => `/uploads/${file.filename}`);

		try {
			// Create the product
			const product = await prisma.product.create({
				data: {
					isActive: true,
					categoryId,
					name,
					price: Number(price),
					description,
					stock: Number(stock)
				},
			});

			// Create Image records for each uploaded file
			const imageRecords = imageUrls.map(url => ({
				url,
				productId: product.id,
			}));

			await prisma.image.createMany({
				data: imageRecords,
			});

			// Fetch the complete product with images after creation
			const productWithImages = await prisma.product.findUnique({
				where: { id: product.id },
				include: {
					images: true,
				},
			});

			res.status(201).json(productWithImages);
		} catch (error) {
			console.log(error.message);
			res.status(500).json({ message: 'Server error' });
		}
	});
});

// Update Product
app.put('/products/:id', authenticateToken, (req, res) => {
	if (!req.user.roles.includes('ADMIN') && !req.user.roles.includes('SUPER_ADMIN')) {
		return res.sendStatus(403);
	}

	upload(req, res, async (err) => {
		if (err) {
			return res.status(400).json({ message: err });
		}

		const { id } = req.params;
		const { isActive, categoryId, name, price, description, keepImageIds = [], stock } = req.body;
		const imageUrls = req.files.map(file => `/uploads/${file.filename}`);

		try {
			// Find the existing product with images
			const existingProduct = await prisma.product.findUnique({
				where: { id },
				include: { images: true },
			});

			if (!existingProduct) {
				return res.status(404).json({ message: 'Product not found' });
			}

			// Filter out images to be kept
			const imagesToKeep = existingProduct.images.filter(image =>
				keepImageIds.includes(image.id)
			);

			// Delete the old images that are not in keepImageIds
			for (const image of existingProduct.images) {
				if (!keepImageIds.includes(image.id)) {
					const imagePath = path.join(__dirname, image.url);
					if (fs.existsSync(imagePath)) {
						fs.unlinkSync(imagePath);
					}

					await prisma.image.delete({
						where: { id: image.id },
					});
				}
			}

			// Create new Image records for the uploaded images
			const newImageRecords = imageUrls.map(url => ({
				url,
				productId: id,
			}));

			await prisma.image.createMany({
				data: newImageRecords,
			});

			// Update the product details
			const updatedProduct = await prisma.product.update({
				where: { id },
				data: { isActive, categoryId, name, price: Number(price), description, stock: Number(stock) },
			});

			// Fetch the updated product with all images (kept + new)
			const productWithImages = await prisma.product.findUnique({
				where: { id: updatedProduct.id },
				include: {
					images: true,
				},
			});

			res.json(productWithImages);
		} catch (error) {
			console.log(error.message);
			res.status(500).json({ message: 'Server error' });
		}
	});
});



// Delete Product and Associated Images
app.delete('/products/:id', authenticateToken, async (req, res) => {
	if (!req.user.roles.includes('ADMIN') && !req.user.roles.includes('SUPER_ADMIN')) {
		return res.sendStatus(403);
	}

	const { id } = req.params;

	try {
		const product = await prisma.product.findUnique({
			where: { id },
			include: { images: true },
		});

		if (!product) {
			return res.status(404).json({ message: 'Product not found' });
		}

		// Delete associated images from the filesystem
		for (const image of product.images) {
			const imagePath = path.join(__dirname, image.url);
			if (fs.existsSync(imagePath)) {
				fs.unlinkSync(imagePath);
			}
		}

		// Delete the associated images from the database
		await prisma.image.deleteMany({
			where: { productId: id },
		});

		// Delete the product from the database
		await prisma.product.delete({
			where: { id },
		});

		res.sendStatus(204);
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ message: 'Server error' });
	}
});


// Get All Products with Associated Images
app.get('/products', async (req, res) => {
	try {
		const products = await prisma.product.findMany({
			include: {
				images: true,
			},
		});
		res.status(200).json(products);
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ message: 'Server error' });
	}
});

// Get Product by ID with Associated Images
app.get('/products/:id', async (req, res) => {
	const { id } = req.params;

	try {
		const product = await prisma.product.findUnique({
			where: { id },
			include: {
				images: true,
			},
		});

		if (!product) {
			return res.status(404).json({ message: 'Product not found' });
		}

		res.status(200).json(product);
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ message: 'Server error' });
	}
});


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
