import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
	server: {
		proxy: {
			'/auth': 'http://localhost:3000',
			'/categories': 'http://localhost:3000',
			'/products': 'http://localhost:3000',
		}
	}
})
