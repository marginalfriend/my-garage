interface RegistrationData {
	name: string;
	email: string;
	phoneNumber: string;
	password: string;
}

export const registerUser = async (userData: RegistrationData) => {
	const response = await fetch('/register', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(userData),
	});

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.error || 'Registration failed');
	}

	return response.json();
};