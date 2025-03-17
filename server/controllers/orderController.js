import { prisma } from "../../prisma-client.js";

export const createOrder = async (req, res) => {
	const { items } = req.body;
	const authorization = req.get("Authorization");
	const accountId = JSON.parse(atob(authorization.split(".")[1])).id;

	try {
		const order = await prisma.$transaction(async (prisma) => {
			const user = await prisma.user.findUnique({
				where: { accountId: accountId },
			});

			if (!user) {
				throw new Error("User not found");
			}

			// Calculate total price and prepare order details
			let totalPrice = 0;
			const orderDetails = [];

			for (const item of items) {
				const product = await prisma.product.findUnique({
					where: { id: item.productId },
					include: {
						ProductBatch: {
							where: { status: 'ACTIVE' },
							orderBy: { orderDate: 'asc' }
						}
					}
				});

				if (!product) {
					throw new Error(`Product with id ${item.productId} not found`);
				}

				// Check if we have enough stock across all active batches
				const totalAvailableStock = product.ProductBatch.reduce(
					(sum, batch) => sum + batch.remainingQuantity,
					0
				);

				if (totalAvailableStock < item.quantity) {
					throw new Error(`Insufficient stock for product ${product.name}`);
				}

				// Update batches using FIFO method
				let remainingQuantityToFulfill = item.quantity;
				for (const batch of product.ProductBatch) {
					if (remainingQuantityToFulfill <= 0) break;

					const quantityFromBatch = Math.min(
						batch.remainingQuantity,
						remainingQuantityToFulfill
					);

					await prisma.productBatch.update({
						where: { id: batch.id },
						data: {
							remainingQuantity: batch.remainingQuantity - quantityFromBatch,
							status: batch.remainingQuantity - quantityFromBatch <= 0
								? 'DEPLETED'
								: 'ACTIVE'
						}
					});

					remainingQuantityToFulfill -= quantityFromBatch;
				}

				// Update product total stock
				await prisma.product.update({
					where: { id: product.id },
					data: {
						stock: product.stock - item.quantity,
					},
				});

				totalPrice += product.price * item.quantity;
				orderDetails.push({
					itemId: item.productId,
					quantity: item.quantity,
					countedPrice: product.price * item.quantity,
				});
			}

			// Create the order
			const newOrder = await prisma.order.create({
				data: {
					customerId: user.id,
					paymentStatus: "PENDING",
					totalPrice: totalPrice,
					orderDetails: {
						create: orderDetails,
					},
				},
				include: {
					orderDetails: true,
				},
			});

			// Remove the purchased items from the cart
			await prisma.cart.deleteMany({
				where: {
					userId: user.id,
					productId: { in: items.map(item => item.productId) },
				},
			});

			return newOrder;
		});

		res.status(201).json(order);
	} catch (error) {
		console.error("Error creating order:", error);
		if (
			error.message === "User not found" ||
			error.message.includes("Product with id") ||
			error.message.includes("Insufficient stock")
		) {
			res.status(404).json({ error: error.message });
		} else {
			res.status(500).json({ error: "An error occurred while creating the order" });
		}
	}
};

export const getUserOrders = async (req, res) => {
	try {
		const authorization = req.get("Authorization");
		const account = JSON.parse(atob(authorization.split(".")[1]));
		const accountId = account.id;

		const user = await prisma.user.findUnique({
			where: { accountId: accountId },
		});

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		if (account.roles.some((x) => x === "SUPER_ADMIN" || x === "ADMIN")) {
			const orders = await prisma.order.findMany();
			res.json(orders);
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
				orderBy: { orderDate: "desc" },
			});
			res.json(orders);
		}
	} catch (error) {
		console.error("Error fetching user orders:", error);
		res.status(500).json({ error: "An error occurred while fetching orders" });
	}
};

export const cancelOrder = async (req, res) => {
	try {
		const { orderId } = req.body;
		const authorization = req.get("Authorization");
		const account = JSON.parse(atob(authorization.split(".")[1]));
		const accountId = account.id;

		const client = await prisma.user.findFirst({
			where: { accountId: accountId },
		});

		const toBeCancelled = await prisma.order.findUnique({
			where: { id: orderId },
			include: {
				customer: true,
				orderDetails: {
					include: {
						product: {
							include: {
								ProductBatch: {
									where: { status: { in: ['ACTIVE', 'DEPLETED'] } },
									orderBy: { orderDate: 'desc' }
								}
							}
						},
					},
				},
			},
		});

		if (!toBeCancelled) {
			return res.status(404).json({ error: "Order not found" });
		}

		if (toBeCancelled.customer.id !== client.id) {
			return res.status(403).json({ error: "You are not authorized to cancel this order" });
		}

		const updatedOrder = await prisma.$transaction(async (prisma) => {
			// Update the order status
			const cancelledOrder = await prisma.order.update({
				where: { id: toBeCancelled.id },
				data: { paymentStatus: "CANCELLED" },
			});

			// Return stock to the most recent batches
			for (const detail of toBeCancelled.orderDetails) {
				let remainingToReturn = detail.quantity;

				// Sort batches by most recent first
				const batches = detail.product.ProductBatch;

				for (const batch of batches) {
					if (remainingToReturn <= 0) break;

					const quantityToReturn = Math.min(
						remainingToReturn,
						batch.quantity - batch.remainingQuantity
					);

					if (quantityToReturn > 0) {
						await prisma.productBatch.update({
							where: { id: batch.id },
							data: {
								remainingQuantity: batch.remainingQuantity + quantityToReturn,
								status: 'ACTIVE'
							}
						});

						remainingToReturn -= quantityToReturn;
					}
				}

				// Update product total stock
				await prisma.product.update({
					where: { id: detail.product.id },
					data: {
						stock: { increment: detail.quantity }
					},
				});
			}

			return cancelledOrder;
		});

		res.status(200).json(updatedOrder);
	} catch (error) {
		console.error("Error cancelling order:", error);
		res.status(500).json({ error: "An error occurred while cancelling the order" });
	}
};

export const getOrderDetails = async (req, res) => {
	try {
		const { orderId } = req.params;
		const authorization = req.get("Authorization");
		const accountId = JSON.parse(atob(authorization.split(".")[1])).id;

		const user = await prisma.user.findUnique({
			where: { accountId: accountId },
		});

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const order = await prisma.order.findUnique({
			where: { id: orderId },
			include: {
				orderDetails: {
					include: {
						product: {
							include: {
								ProductBatch: {
									select: {
										cost: true
									}
								}
							}
						},
					},
				},
			},
		});

		if (!order) {
			return res.status(404).json({ error: "Order not found" });
		}

		if (order.customerId !== user.id) {
			return res.status(403).json({ error: "You are not authorized to view this order" });
		}

		// Calculate average cost for each order detail
		const orderWithCost = {
			...order,
			orderDetails: order.orderDetails.map(detail => ({
				...detail,
				cost: detail.product.ProductBatch.length > 0
					? Math.round(detail.product.ProductBatch.reduce((sum, batch) => sum + batch.cost, 0) / detail.product.ProductBatch.length)
					: 0,
				product: {
					...detail.product,
					ProductBatch: undefined // Remove ProductBatch from response
				}
			}))
		};

		res.json(orderWithCost);
	} catch (error) {
		console.error("Error fetching order details:", error);
		res.status(500).json({ error: "An error occurred while fetching order details" });
	}
};

export const getPaginatedOrders = async (req, res) => {
	try {
		const authorization = req.get("Authorization");
		const account = JSON.parse(atob(authorization.split(".")[1]));
		const accountId = account.id;

		// Find the user by accountId
		const user = await prisma.user.findUnique({
			where: { accountId: accountId },
		});

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		// Check if the user has ADMIN or SUPER_ADMIN role
		if (!account.roles.includes("OWNER") && !account.roles.includes("SUPER_ADMIN")) {
			return res.status(403).json({ error: "You are not authorized to access this information" });
		}

		const { page = 1, limit = 10, sort = "desc", paymentStatus, id } = req.query;
		const skip = (page - 1) * limit;

		const whereClause = {};
		if (paymentStatus) whereClause.paymentStatus = paymentStatus;
		if (id) whereClause.id = id;

		const [orders, totalOrders] = await prisma.$transaction([
			prisma.order.findMany({
				where: whereClause,
				skip: skip,
				take: parseInt(limit),
				orderBy: { orderDate: sort === "asc" ? "asc" : "desc" },
				include: {
					orderDetails: {
						include: {
							product: {
								include: {
									ProductBatch: {
										select: {
											cost: true
										}
									}
								}
							}
						}
					}
				}
			}),
			prisma.order.count({
				where: whereClause,
			}),
		]);

		// Calculate average cost for each order detail
		const ordersWithCost = orders.map(order => {
			const orderDetails = order.orderDetails.map(detail => ({
				...detail,
				cost: detail.product.ProductBatch.length > 0
					? Math.round(detail.product.ProductBatch.reduce((sum, batch) => sum + batch.cost, 0) / detail.product.ProductBatch.length)
					: 0,
				product: {
					...detail.product,
					ProductBatch: undefined // Remove ProductBatch from response
				}
			}));

			// Calculate total cost for the order
			const totalCost = orderDetails.reduce((sum, detail) =>
				sum + (detail.cost * detail.quantity), 0
			);

			return {
				...order,
				orderDetails,
				cost: totalCost
			};
		});

		res.json({
			orders: ordersWithCost,
			totalOrders,
			totalPages: Math.ceil(totalOrders / limit),
			currentPage: parseInt(page),
		});
	} catch (error) {
		console.error("Error fetching orders:", error);
		res.status(500).json({ error: "An error occurred while fetching orders" });
	}
};

export const updateOrder = async (req, res) => {
	try {
		const { orderId } = req.params;
		const { paymentStatus } = req.body;

		// Extract account information from the Authorization header
		const authorization = req.get("Authorization");
		const account = JSON.parse(atob(authorization.split(".")[1]));
		const accountId = account.id;

		// Find the user by accountId
		const user = await prisma.user.findUnique({
			where: { accountId: accountId },
		});

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		// Check if the user has ADMIN or SUPER_ADMIN role
		if (
			!account.roles.includes("OWNER") &&
			!account.roles.includes("SUPER_ADMIN")
		) {
			return res
				.status(403)
				.json({ error: "You are not authorized to update this order" });
		}

		// Find the order by orderId
		const order = await prisma.order.findUnique({
			where: { id: orderId },
		});

		if (!order) {
			return res.status(404).json({ error: "Order not found" });
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
		console.error("Error updating order:", error);
		res
			.status(500)
			.json({ error: "An error occurred while updating the order" });
	}
};

export const checkStock = async (req, res) => {
	try {
		const { orderId } = req.params;
		let productNames = [];

		const order = await prisma.order.findUnique({
			where: {
				id: orderId,
			},
			include: {
				orderDetails: true,
			},
		});

		const orderDetails = order.orderDetails;

		for (const detail of orderDetails) {
			const product = await prisma.product.findUnique({
				where: {
					id: detail.itemId,
				},
			});

			if (product.stock <= 1) {
				productNames.push(product.name);
			}
		}

		res.status(200).json(productNames);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "An error occurred while fetching orders" });
	}
};

export const getAllProductBatches = async (req, res) => {
	try {
		const { page = 1, limit = 10, productId } = req.query;
		const skip = (page - 1) * limit;

		// Build where clause
		const whereClause = {};
		if (productId) {
			whereClause.productId = productId;
		}

		const [batches, totalBatches] = await prisma.$transaction([
			prisma.productBatch.findMany({
				where: whereClause,
				skip: skip,
				take: parseInt(limit),
				orderBy: { orderDate: 'desc' },
				include: {
					product: {
						select: {
							name: true,
							price: true
						}
					}
				}
			}),
			prisma.productBatch.count({
				where: whereClause
			})
		]);

		res.json({
			batches,
			totalBatches,
			totalPages: Math.ceil(totalBatches / limit),
			currentPage: parseInt(page)
		});
	} catch (error) {
		console.error("Error fetching product batches:", error);
		res.status(500).json({ error: "An error occurred while fetching product batches" });
	}
};
