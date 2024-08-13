interface RegistrationData {
	name: string;
	email: string;
	phoneNumber: string;
	password: string;
}

export const registerUser = async (userData: RegistrationData) => {
	const response = await fetch('/api/auth/register', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(userData),
	});

	if (!response.ok) {
		const errorData = await response.json();
		console.log(response)
		throw new Error(errorData.error || 'Registration failed');
	}

	return response.json();
};