import { prisma } from '../../prisma-client.js';

export const createOrder = async (req, res) => {
	try {
		const { items } = req.body;
		const authorization = req.get('Authorization');
		const accountId = JSON.parse(atob(authorization.split(".")[1])).id;

		const user = await prisma.user.findUnique({
			where: { accountId: accountId },
		});

		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}

		// Start a transaction
		const order = await prisma.$transaction(async (prisma) => {
			// Calculate total price and create order details
			let totalPrice = 0;
			const orderDetails = [];

			for (const item of items) {
				const product = await prisma.product.findUnique({
					where: { id: item.productId },
				});

				if (!product) {
					throw new Error(`Product with ID ${item.productId} not found`);
				}

				if (product.stock < item.quantity) {
					throw new Error(`Insufficient stock for product ${product.name}`);
				}

				const itemTotalPrice = product.price * item.quantity;
				totalPrice += itemTotalPrice;

				orderDetails.push({
					itemId: product.id,
					quantity: item.quantity,
					countedPrice: itemTotalPrice,
				});

				// Update product stock
				await prisma.product.update({
					where: { id: product.id },
					data: { stock: product.stock - item.quantity },
				});
			}

			// Create the order
			const newOrder = await prisma.order.create({
				data: {
					customerId: user.id,
					totalPrice,
					orderDetails: {
						create: orderDetails,
					},
				},
				include: {
					orderDetails: true,
				},
			});

			// Clear the user's cart
			await prisma.cart.deleteMany({
				where: { userId: user.id },
			});

			return newOrder;
		});

		res.status(201).json(order);
	} catch (error) {
		console.error('Error creating order:', error);
		res.status(400).json({ error: error.message });
	}
};

export const getUserOrders = async (req, res) => {
	try {
		const authorization = req.get('Authorization');
		const accountId = JSON.parse(atob(authorization.split(".")[1])).id;

		const user = await prisma.user.findUnique({
			where: { accountId: accountId },
		});

		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}

		const orders = await prisma.order.findMany({
			where: { customerId: user.id },
			include: {
				orderDetails: {
					include: {
						product: true,
					},
				},
			},
			orderBy: { orderDate: 'desc' },
		});

		res.json(orders);
	} catch (error) {
		console.error('Error fetching user orders:', error);
		res.status(500).json({ error: 'An error occurred while fetching orders' });
	}
};

export const getOrderDetails = async (req, res) => {
	try {
		const { orderId } = req.params;
		const authorization = req.get('Authorization');
		const accountId = JSON.parse(atob(authorization.split(".")[1])).id;

		const user = await prisma.user.findUnique({
			where: { accountId: accountId },
		});

		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}

		const order = await prisma.order.findUnique({
			where: { id: orderId },
			include: {
				orderDetails: {
					include: {
						product: true,
					},
				},
			},
		});

		if (!order) {
			return res.status(404).json({ error: 'Order not found' });
		}

		if (order.customerId !== user.id) {
			return res.status(403).json({ error: 'You are not authorized to view this order' });
		}

		res.json(order);
	} catch (error) {
		console.error('Error fetching order details:', error);
		res.status(500).json({ error: 'An error occurred while fetching order details' });
	}
};