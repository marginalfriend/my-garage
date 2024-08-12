// authController.js
import { compare, hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from "../../prisma-client.js";

const { sign } = jwt;

export const login = async (req, res) => {
	const { email, password } = req.body;
	const account = await prisma.account.findUnique({ where: { email } });

	if (!account || !(await compare(password, account.password))) {
		return res.status(403).send('Invalid credentials');
	}

	const roles = await prisma.accountRole.findMany({
		where: { accountId: account.id },
		include: { role: true }
	});

	const roleNames = roles.map(r => r.role.name);

	const user = { id: account.id, roles: roleNames };
	const accessToken = sign(user, process.env.ACCESS_TOKEN_SECRET);

	res.json({ accessToken });
};

export const register = async (req, res) => {
	const { name, email, password, phoneNumber } = req.body;

	try {
		const existingAccount = await prisma.account.findUnique({
			where: { email },
		});

		if (existingAccount) {
			return res.status(400).json({ error: 'Email already in use' });
		}

		const hashedPassword = await hash(password, 10);

		const result = await prisma.$transaction(async (prisma) => {
			const account = await prisma.account.create({
				data: {
					email,
					password: hashedPassword,
				},
			});

			const user = await prisma.user.create({
				data: {
					name,
					phoneNumber,
					account: {
						connect: { id: account.id },
					},
				},
			});

			const customerRole = await prisma.role.upsert({
				where: { name: 'CUSTOMER' },
				update: {},
				create: {
					name: 'CUSTOMER',
				},
			});

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
};