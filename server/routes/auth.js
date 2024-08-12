import { Router } from 'express';
import { compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { account as _account, accountRole } from '../../prisma-client.js';

const router = Router();
const { sign } = jwt;

router.post('/login', async (req, res) => {
	const { email, password } = req.body;
	const account = await _account.findUnique({ where: { email } });

	if (!account || !(await compare(password, account.password))) {
		return res.status(403).send('Invalid credentials');
	}

	const roles = await accountRole.findMany({
		where: { accountId: account.id },
		include: { role: true }
	});

	const roleNames = roles.map(r => r.role.name);

	const user = { id: account.id, roles: roleNames };
	const accessToken = sign(user, process.env.ACCESS_TOKEN_SECRET);

	res.json({ accessToken });
});

app.post('/register', async (req, res) => {
	const { name, email, password, phoneNumber } = req.body;

	try {
		// Check if the email is already in use
		const existingAccount = await prisma.account.findUnique({
			where: { email },
		});

		if (existingAccount) {
			return res.status(400).json({ error: 'Email already in use' });
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Start a transaction
		const result = await prisma.$transaction(async (prisma) => {
			// Create the Account
			const account = await prisma.account.create({
				data: {
					email,
					password: hashedPassword,
				},
			});

			// Create the User and link it to the Account
			const user = await prisma.user.create({
				data: {
					name,
					phoneNumber,
					account: {
						connect: { id: account.id },
					},
				},
			});

			// Find the CUSTOMER role
			const customerRole = await prisma.role.findUnique({
				where: { name: 'CUSTOMER' },
			});

			if (!customerRole) {
				throw new Error('CUSTOMER role not found');
			}

			// Create the AccountRole association
			await prisma.accountRole.create({
				data: {
					account: { connect: { id: account.id } },
					role: { connect: { id: customerRole.id } },
				},
			});

			return { account, user };
		});

		res.status(201).json({
			message: 'User registered successfully',
			userId: result.user.id,
		});
	} catch (error) {
		console.error('Registration error:', error);
		res.status(500).json({ error: 'An error occurred during registration' });
	}
});

export default router;
