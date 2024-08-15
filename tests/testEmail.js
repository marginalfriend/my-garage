import emailjs from '@emailjs/browser'

const options = { publicKey: process.env.EMAILJS_PUBLIC_KEY };
const serviceId = process.env.EMAILJS_SERVICE_ID;
const templateId = process.env.TEMPLATE_ID;

const sendStockAlert = async () => {
	try {
		const templateParams = {
			product_name: "Product"
		}

		await emailjs.send('service_9xl6lvr', 'template_fd3lima', templateParams, { publicKey: 'ZyFfM669asnsmKB8t' })
	} catch (error) {
		console.error("Failed to send stock alert email:", error);
	}
};

sendStockAlert()