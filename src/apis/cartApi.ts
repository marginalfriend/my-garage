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

export const updateCartItem = async (accountId: string, productId: string, quantity: number, token: string) => {
	const response = await fetch(`/api/cart`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			"Authorization": token,
		},
		body: JSON.stringify({ accountId, productId, quantity }),
	});

	if (!response.ok) {
		console.log(response)
		throw new Error("Failed to update cart item");
	}

	if (!response.body) return;

	return await response.json();
};

export const deleteCartItem = async (productId: string, token: string, accountId: string) => {
	const response = await fetch('/api/cart', {
		method: "DELETE",
		headers: {
			"Authorization": token,
		},
		body: JSON.stringify({
			productId,
			accountId
		})
	});

	if (!response.ok) {
		throw new Error("Failed to delete cart item");
	}

	if (response.status === 204) return

	return await response.json();
};

export const getUserCartItemByProductId = async (token: string, productId: string) => {
	const response = await fetch(`/api/cart/${productId}`, {
		method: "GET",
		headers: {
			"Authorization": token,
		}
	});

	if (!response.ok) {
		throw new Error("Failed to get cart item.");
	}

	return await response.json();
}