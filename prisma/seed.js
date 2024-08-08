// prisma/seed.js

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { hash } from "bcrypt";

async function main() {
	const hashedPassword = await hash('superadminpassword', 10);

	// Create super admin role
	const superAdminRole = await prisma.role.create({
		data: {
			name: 'SUPER_ADMIN'
		}
	});

	// Create super admin account
	const superAdminAccount = await prisma.account.create({
		data: {
			email: 'superadmin@gk5garage.com',
			password: hashedPassword
		}
	});

	// Assign role to account
	await prisma.accountRole.create({
		data: {
			accountId: superAdminAccount.id,
			roleId: superAdminRole.id
		}
	});

	// Create user profile
	await prisma.user.create({
		data: {
			accountId: superAdminAccount.id,
			name: 'Super Admin'
		}
	});

	console.log('Seeded Super Admin');
}

main()
	.catch(e => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
