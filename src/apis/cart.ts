export const addToCart = async (productId: string, quantity: number, token: string, accountId: string) => {
	const response = await fetch("/api/cart", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Authorization": token,
		},
		body: JSON.stringify({ productId, quantity, accountId }),
	});

	if (!response.ok) {
		throw new Error("Failed to add product to cart: " + response.body);
	}

	return await response.json();
};

export const getCartItems = async (token: string) => {
	const response = await fetch("/api/cart", {
		method: "GET",
		headers: {
			"Authorization": token,
		},
	});

	if (!response.ok) {
		throw new Error("Failed to fetch cart items");
	}

	return await response.json();
};

export const updateCartItem = async (cartItemId: string, quantity: number, token: string) => {
	const response = await fetch(`/api/cart/${cartItemId}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			"Authorization": token,
		},
		body: JSON.stringify({ quantity }),
	});

	if (!response.ok) {
		throw new Error("Failed to update cart item");
	}

	return await response.json();
};

export const deleteCartItem = async (cartItemId: string, token: string) => {
	const response = await fetch(`/api/cart/${cartItemId}`, {
		method: "DELETE",
		headers: {
			"Authorization": token,
		},
	});

	if (!response.ok) {
		throw new Error("Failed to delete cart item");
	}

	return await response.json();
};