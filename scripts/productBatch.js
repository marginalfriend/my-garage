import { PrismaClient } from '@prisma/client'
import { generateBatchNumber } from '../server/lib/utils'
const prisma = new PrismaClient()

async function main() {
	// Get all existing products
	const products = await prisma.product.findMany()

	// Create initial batch for each product
	for (const product of products) {
		await prisma.productBatch.create({
			data: {
				batchNumber: generateBatchNumber(product),
				cost: product.price, // Using price as initial cost, adjust if needed
				quantity: product.stock,
				remainingQuantity: product.stock,
				status: 'ACTIVE',
				productId: product.id,
			}
		})
	}

	console.log('Initial product batches created!')
}

main()
	.catch(console.error)
	.finally(() => prisma.$disconnect())