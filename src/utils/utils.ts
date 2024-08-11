export function formatIDR(amount: number): string {
	// Convert the number to a string and split it into integer and decimal parts
	const [integer, decimal] = amount.toFixed(2).split('.');

	// Add thousand separators to the integer part
	const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

	// Combine the parts and add the IDR symbol
	return `Rp ${formattedInteger},${decimal}`;
}