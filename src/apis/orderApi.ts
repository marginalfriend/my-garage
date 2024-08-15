export const cancelOrder = async (token: string, orderId: string) => {
	try {
		const res = await fetch("/api/orders", {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				Authorization: token,
			},
			body: JSON.stringify({ orderId }),
		});

		if (res.status !== 200) {
			console.log(res);
		} else {
			return await res.json();
		}
	} catch (error) {
		console.log(error)
	}
};

export const checkStock = async (token: string, orderId: string) => {
	try {
		const res = await fetch(`/api/orders/checkstok/${orderId}`, {
			headers: {
				Authorization: token
			},
		})

		if (!res.ok) {
			throw new Error(await res.json())
		}

		return await res.json()
	} catch (error) {
		console.log(error)
	}
}