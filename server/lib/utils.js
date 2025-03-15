export function generateBatchNumber(product) {
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
	const dateStr = `${month}${day}${year}`;

	// Combine all parts with hyphens
	return `${nameAbbr}-${productIdPrefix}-${dateStr}`;
}