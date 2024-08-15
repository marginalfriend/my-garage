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
					paymentStatus: "PENDING",
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
		const account = JSON.parse(atob(authorization.split(".")[1]));
		const accountId = account.id;

		const user = await prisma.user.findUnique({
			where: { accountId: accountId },
		});

		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}

		if (account.roles.some(
			(x) => x === "SUPER_ADMIN" || x === "ADMIN"
		)) {

			const orders = await prisma.order.findMany()
			res.json(orders)
		} else {

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

		}
	} catch (error) {

		console.error('Error fetching user orders:', error);
		res.status(500).json({ error: 'An error occurred while fetching orders' });

	}
};

export const cancelOrder = async (req, res) => {
	try {
		console.log(req.body)
		const { orderId } = req.body;
		const authorization = req.get('Authorization');
		const account = JSON.parse(atob(authorization.split(".")[1]));
		const accountId = account.id;

		const client = await prisma.user.findFirst({
			where: {
				accountId: accountId
			}
		});

		console.log(orderId)

		const toBeCancelled = await prisma.order.findUnique({
			where: {
				id: orderId
			},
			include: {
				customer: true,
				orderDetails: {
					include: {
						product: true
					}
				}
			}
		});

		console.log(toBeCancelled)

		if (!toBeCancelled) {
			return res.status(404).json({ error: 'Order not found' });
		}

		if (toBeCancelled.customer.id !== client.id) {
			return res.status(403).json({ error: 'You are not authorized to cancel this order' });
		}

		// Use a transaction to ensure all operations are atomic
		const updatedOrder = await prisma.$transaction(async (prisma) => {
			// Update the order status
			const cancelledOrder = await prisma.order.update({
				where: {
					id: toBeCancelled.id
				},
				data: {
					paymentStatus: "CANCELLED"
				}
			});

			// Update product stock for each order detail
			for (const detail of toBeCancelled.orderDetails) {
				console.log(`Updating product ${detail.product.id}:`);
				console.log(`  Current stock: ${detail.product.stock}`);
				console.log(`  Quantity to add back: ${detail.quantity}`);
				console.log(`  Expected new stock: ${detail.product.stock + detail.quantity}`);

				const updatedProduct = await prisma.product.update({
					where: {
						id: detail.product.id
					},
					data: {
						stock: {
							increment: detail.quantity
						}
					}
				});

				console.log(`Actual new stock: ${updatedProduct.stock}`);
			}

			return cancelledOrder;
		});

		res.status(200).json(updatedOrder);

	} catch (error) {
		console.error('Error cancelling order:', error);
		res.status(500).json({ error: 'An error occurred while cancelling the order' });
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

export const getPaginatedOrders = async (req, res) => {
	try {

		const authorization = req.get('Authorization');
		const account = JSON.parse(atob(authorization.split(".")[1]));
		const accountId = account.id;

		// Find the user by accountId
		const user = await prisma.user.findUnique({
			where: { accountId: accountId },
		});

		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}

		// Check if the user has ADMIN or SUPER_ADMIN role
		if (!account.roles.includes("ADMIN") && !account.roles.includes("SUPER_ADMIN")) {
			return res.status(403).json({ error: 'You are not authorized to access this information' });
		}

		const { page = 1, limit = 10, sort = 'desc', paymentStatus } = req.query;
		const skip = (page - 1) * limit;

		const whereClause = paymentStatus
			? { paymentStatus: paymentStatus }
			: {};

		const [orders, totalOrders] = await prisma.$transaction([
			prisma.order.findMany({
				where: whereClause,
				skip: skip,
				take: parseInt(limit),
				orderBy: { orderDate: sort === 'asc' ? 'asc' : 'desc' },
			}),
			prisma.order.count({
				where: whereClause,
			}),
		]);

		res.json({
			orders,
			totalOrders,
			totalPages: Math.ceil(totalOrders / limit),
			currentPage: parseInt(page),
		});
	} catch (error) {
		console.error('Error fetching orders:', error);
		res.status(500).json({ error: 'An error occurred while fetching orders' });
	}
};


export const updateOrder = async (req, res) => {
	try {
		const { orderId } = req.params;
		const { paymentStatus } = req.body;

		// Extract account information from the Authorization header
		const authorization = req.get('Authorization');
		const account = JSON.parse(atob(authorization.split(".")[1]));
		const accountId = account.id;

		// Find the user by accountId
		const user = await prisma.user.findUnique({
			where: { accountId: accountId },
		});

		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}

		// Check if the user has ADMIN or SUPER_ADMIN role
		if (!account.roles.includes("ADMIN") && !account.roles.includes("SUPER_ADMIN")) {
			return res.status(403).json({ error: 'You are not authorized to update this order' });
		}

		// Find the order by orderId
		const order = await prisma.order.findUnique({
			where: { id: orderId },
		});

		if (!order) {
			return res.status(404).json({ error: 'Order not found' });
		}

		// Update the order's payment status
		const updatedOrder = await prisma.order.update({
			where: { id: orderId },
			data: {
				paymentStatus: paymentStatus,
			},
		});

		res.json(updatedOrder);
	} catch (error) {
		console.error('Error updating order:', error);
		res.status(500).json({ error: 'An error occurred while updating the order' });
	}
};

export const checkStock = async (req, res) => {
	try {
		const { orderId } = req.params;
		let productNames = [];

		const order = await prisma.order.findUnique({
			where: {
				id: orderId
			},
			include: {
				orderDetails: true
			}
		});

		const orderDetails = order.orderDetails;

		for (const detail of orderDetails) {
			const product = await prisma.product.findUnique({
				where: {
					id: detail.itemId
				}
			})

			if (product.stock <= 1) {
				productNames.push(product.name)
			}
		}

		res.status(200).json(productNames)
	} catch (error) {
		console.log(error)
		res.status(500).json({ error: 'An error occurred while fetching orders' });
	}
}