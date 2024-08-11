import { category as _category } from '../../prisma-client.js';

export const createCategory = async (req, res, next) => {
	try {
		if (!req.user.roles.includes('ADMIN') && !req.user.roles.includes('SUPER_ADMIN')) {
			return res.sendStatus(403);
		}
		const { name, isActive } = req.body;
		const category = await _category.create({
			data: { name, isActive }
		});
		res.json(category);
	} catch (error) {
		next(error);
	}
};

export const getCategories = async (req, res, next) => {
	try {
		const { query } = req.query;
		let categories;
		if (query) {
			categories = await _category.findMany({
				where: {
					name: {
						contains: query,
						mode: 'insensitive',
					},
				},
			});
		} else {
			categories = await _category.findMany();
		}
		res.json(categories);
	} catch (error) {
		next(error);
	}
};

export const getCategoryById = async (req, res, next) => {
	try {
		const { id } = req.params;
		const category = await _category.findUnique({
			where: { id }
		});
		res.json(category);
	} catch (error) {
		next(error);
	}
};

export const updateCategory = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { name, isActive } = req.body;
		const category = await _category.update({
			where: { id },
			data: { name, isActive }
		});
		res.json(category);
	} catch (error) {
		next(error);
	}
};

export const deleteCategory = async (req, res, next) => {
	try {
		const { id } = req.params;
		await _category.delete({
			where: { id }
		});
		res.sendStatus(204);
	} catch (error) {
		next(error);
	}
};