/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
  theme: {
    extend: {
			colors: {
				"background": "#ffffff",
				"default": "#444444",
				"heading": "#37517e",
				"accent": "#47b2e4",
				"surface": "#ffffff",
				"contrast": "#ffffff",
			}
		},
  },
  plugins: [],
}

