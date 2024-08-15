import { prisma } from '../../prisma-client.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createProduct = async (req, res, next) => {
	try {
		if (!req.user.roles.includes('ADMIN') && !req.user.roles.includes('SUPER_ADMIN')) {
			return res.sendStatus(403);
		}

		const { categoryId, name, price, description, stock } = req.body;
		const imageUrls = req.files.map(file => `/uploads/${file.filename}`);

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

		const imageRecords = imageUrls.map(url => ({
			url,
			productId: product.id,
		}));

		await prisma.image.createMany({
			data: imageRecords,
		});

		const productWithImages = await prisma.product.findUnique({
			where: { id: product.id },
			include: {
				images: true,
			},
		});

		res.status(201).json(productWithImages);
	} catch (error) {
		next(error);
	}
};

export const updateProduct = async (req, res, next) => {
	try {
		if (!req.user.roles.includes('ADMIN') && !req.user.roles.includes('SUPER_ADMIN')) {
			return res.sendStatus(403);
		}

		const { id } = req.params;
		const { isActive, categoryId, name, price, description, keepImageIds = [], stock } = req.body;
		const imageUrls = req.files.map(file => `/uploads/${file.filename}`);

		const existingProduct = await prisma.product.findUnique({
			where: { id },
			include: { images: true },
		});

		if (!existingProduct) {
			return res.status(404).json({ message: 'Product not found' });
		}

		// Delete old images
		for (const image of existingProduct.images) {
			if (!keepImageIds.includes(image.id)) {
				const imagePath = path.join(__dirname, '..', '..', image.url);
				if (fs.existsSync(imagePath)) {
					fs.unlinkSync(imagePath);
				}

				await prisma.image.delete({
					where: { id: image.id },
				});
			}
		}

		// Create new Image records
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
			data: { isActive: isActive === "true", categoryId, name, price: Number(price), description, stock: Number(stock) },
		});

		const productWithImages = await prisma.product.findUnique({
			where: { id: updatedProduct.id },
			include: {
				images: true,
			},
		});

		res.json(productWithImages);
	} catch (error) {
		next(error);
	}
};

export const deleteProduct = async (req, res, next) => {
	try {
		if (!req.user.roles.includes('ADMIN') && !req.user.roles.includes('SUPER_ADMIN')) {
			return res.sendStatus(403);
		}

		const { id } = req.params;

		const product = await prisma.product.findUnique({
			where: { id },
			include: { images: true },
		});

		if (!product) {
			return res.sendStatus(204);
		}

		// Start a transaction
		await prisma.$transaction(async (prisma) => {
			// Delete associated cart items
			await prisma.cart.deleteMany({
				where: { productId: id },
			});

			// Delete associated images from the filesystem
			for (const image of product.images) {
				const imagePath = path.join(__dirname, '..', '..', image.url);
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
		});

		res.sendStatus(204);
	} catch (error) {
		next(error);
	}
};

export const getAllProducts = async (req, res, next) => {
	try {
		const products = await prisma.product.findMany({
			include: {
				images: true,
				category: true,
			},
		});
		res.status(200).json(products);
	} catch (error) {
		next(error);
	}
};

export const getProductById = async (req, res, next) => {
	try {
		const { id } = req.params;
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
		next(error);
	}
};