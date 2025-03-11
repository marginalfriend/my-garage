// prisma/seed.js

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { hash } from "bcrypt";

async function main() {
	const superAdminPassword = await hash('superadminpassword', 10);
	const ownerPassword = await hash('superadminpassword', 10);

	// Create super admin role
	const superAdminRole = await prisma.role.create({
		data: {
			name: 'SUPER_ADMIN'
		}
	});

	const ownerRole = await prisma.role.create({
		data: {
			name: 'OWNER'
		}
	});

	// Create super admin account
	const superAdminAccount = await prisma.account.create({
		data: {
			email: 'superadmin@gk5garage.com',
			password: superAdminPassword
		}
	});

	const ownerAccount = await prisma.account.create({
		data: {
			email: 'owner@gk5garage.com',
			password: ownerPassword
		}
	});

	// Assign role to account
	await prisma.accountRole.create({
		data: {
			accountId: superAdminAccount.id,
			roleId: superAdminRole.id
		}
	});

	await prisma.accountRole.create({
		data: {
			accountId: ownerAccount.id,
			roleId: ownerRole.id
		}
	});

	// Create user profile
	await prisma.user.create({
		data: {
			accountId: superAdminAccount.id,
			name: 'Super Admin'
		}
	});

	await prisma.user.create({
		data: {
			accountId: ownerAccount.id,
			name: 'Owner'
		}
	});

	console.log('Seeded Super Admin');
	console.log('Seeded Owner');
}

main()
	.catch(e => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
