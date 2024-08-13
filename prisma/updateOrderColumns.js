import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function update() {
	try {
		await prisma.order.updateMany({
			data: {
				paymentStatus: "PENDING"
			}
		})

		console.log("Successfully updated order")
	} catch (e) {
		console.log(e)
	}
}

update()