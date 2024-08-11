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

export default router;
