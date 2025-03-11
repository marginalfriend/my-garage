// prisma/seed.js

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { hash } from "bcrypt";

async function main() {
	const superAdminPassword = await hash('superadminpassword', 10);
	const ownerPassword = await hash('superadminpassword', 10);

	// Create super admin role if it doesn't exist
	const superAdminRole = await prisma.role.upsert({
		where: { name: 'SUPER_ADMIN' },
		update: {},
		create: { name: 'SUPER_ADMIN' }
	});

	const ownerRole = await prisma.role.upsert({
		where: { name: 'OWNER' },
		update: {},
		create: { name: 'OWNER' }
	});

	// Create super admin account if it doesn't exist
	const superAdminAccount = await prisma.account.upsert({
		where: { email: 'superadmin@gk5garage.com' },
		update: {},
		create: {
			email: 'superadmin@gk5garage.com',
			password: superAdminPassword
		}
	});

	const ownerAccount = await prisma.account.upsert({
		where: { email: 'owner@gk5garage.com' },
		update: {},
		create: {
			email: 'owner@gk5garage.com',
			password: ownerPassword
		}
	});

	// Assign role to account if it doesn't exist
	await prisma.accountRole.upsert({
		where: {
			account: superAdminAccount,
			role: superAdminRole
		},
		update: {},
		create: {
			accountId: superAdminAccount.id,
			roleId: superAdminRole.id
		}
	});

	await prisma.accountRole.upsert({
		where: {
			account: superAdminAccount,
			role: superAdminRole
		},
		update: {},
		create: {
			accountId: ownerAccount.id,
			roleId: ownerRole.id
		}
	});

	// Create user profile if it doesn't exist
	await prisma.user.upsert({
		where: { accountId: superAdminAccount.id },
		update: {},
		create: {
			accountId: superAdminAccount.id,
			name: 'Super Admin'
		}
	});

	await prisma.user.upsert({
		where: { accountId: ownerAccount.id },
		update: {},
		create: {
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
