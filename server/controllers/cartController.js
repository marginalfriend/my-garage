import { product as _product, prisma } from '../../prisma-client.js';

export const addToCart = async (req, res) => {
	const { accountId, productId, quantity } = req.body;

	try {
		// Check if the user exists
		console.log("Account ID: " + accountId)
		const user = await prisma.user.findUnique({
			where: { accountId: accountId },
		});

		if (!user) {
			console.log("User not found")
			return res.status(404).json({ error: 'User not found' });
		}

		// Check if the product exists and is active
		const product = await prisma.product.findUnique({
			where: { id: productId, isActive: true },
		});

		if (!product) {
			console.log("Product not found")
			return res.status(404).json({ error: 'Product not found or inactive' });
		}

		// Check if the product is in stock
		if (product.stock < quantity) {
			return res.status(400).json({ error: 'Insufficient stock' });
		}

		// Check if the item already exists in the cart
		const existingCartItem = await prisma.cart.findFirst({
			where: { userId: user.id, productId },
		});

		let cartItem;

		if (existingCartItem) {
			// Update the quantity if the item is already in the cart
			cartItem = await prisma.cart.update({
				where: { id: existingCartItem.id },
				data: { quantity: existingCartItem.quantity + quantity },
			});
		} else {
			// Create a new cart item if it doesn't exist
			cartItem = await prisma.cart.create({
				data: { userId: user.id, productId, quantity },
			});
		}

		res.status(200).json({ message: 'Product added to cart successfully', cartItem });
	} catch (error) {
		console.error('Error adding product to cart:', error);
		res.status(500).json({ error: 'An error occurred while adding the product to cart' });
	}
};


export const getUserCart = async (req, res) => {
	try {
		const userId = req.user.id; // Assuming req.user is populated by the authenticateToken middleware

		// Fetch the user's cart items along with the associated product details
		const cartItems = await prisma.cart.findMany({
			where: { userId },
			include: {
				product: true, // Include the related product details
			},
		});

		res.status(200).json(cartItems);
	} catch (error) {
		console.error('Error fetching cart items:', error);
		res.status(500).json({ message: 'Server error' });
	}
};

export const updateCartItem = async (req, res) => {
	try {
		const { productId, quantity } = req.body;
		const userId = req.user.id;

		// Find the cart item
		const cartItem = await prisma.cart.findUnique({
			where: {
				userId: userId,
				productId: productId,
			},
		});

		if (!cartItem) {
			return res.status(404).json({ message: 'Cart item not found' });
		}

		if (quantity === 0) {
			// If the quantity is 0, delete the cart item
			await prisma.cart.delete({
				where: {
					id: cartItem.id,
				},
			});
			return res.status(204).send();
		} else {
			// Otherwise, update the quantity
			const updatedCartItem = await prisma.cart.update({
				where: {
					id: cartItem.id,
				},
				data: {
					quantity: quantity,
				},
			});
			return res.status(200).json(updatedCartItem);
		}
	} catch (error) {
		console.error('Error updating cart item:', error);
		res.status(500).json({ message: 'Server error' });
	}
};

export const deleteCartItem = async (req, res) => {
	try {
		const { productId } = req.body;
		const userId = req.user.id;

		// Find the cart item
		const cartItem = await prisma.cart.findUnique({
			where: {
				userId: userId,
				productId: productId
			},
		});

		if (!cartItem) {
			return res.status(404).json({ message: 'Cart item not found' });
		}

		// Delete the cart item
		await prisma.cart.delete({
			where: {
				id: cartItem.id,
			},
		});

		res.status(204).send();
	} catch (error) {
		console.error('Error deleting cart item:', error);
		res.status(500).json({ message: 'Server error' });
	}
};
