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
			},
			keyframes: {
				'slide-in': {
					'0%': {
						transform: 'translateX(-100%)',
						opacity: '0',
					},
					'100%': {
						transform: 'translateX(0)',
						opacity: '1',
					},
				},
			},
			animation: {
				'slide-in-2': 'slide-in 2s ease-out forwards',
				'slide-in-1': 'slide-in 1s ease-out forwards',
				'slide-in-half': 'slide-in 0.5s ease-out forwards',
			},
		},
	},
	plugins: [],
}

