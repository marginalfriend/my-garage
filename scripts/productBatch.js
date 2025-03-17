import { PrismaClient } from '@prisma/client'
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

function generateBatchNumber(product) {
	// Get product name abbreviation (take first letter of each word)
	const nameAbbr = product.name
		.split(' ')
		.map(word => word.charAt(0))
		.join('')
		.toUpperCase();

	// Get first 4 characters of product ID and convert to uppercase
	const productIdPrefix = product.id.slice(0, 4).toUpperCase();

	// Get current date in MMDDYYYY format
	const date = new Date();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	const year = date.getFullYear();
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	const dateStr = `${month}${day}${year}`;
	const timeStr = `${hours}${minutes}`;

	// Combine all parts with hyphens
	return `${nameAbbr}-${productIdPrefix}-${dateStr}-${timeStr}`;
}

main()
	.catch(console.error)
	.finally(() => prisma.$disconnect())