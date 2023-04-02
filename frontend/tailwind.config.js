/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				Agrandir: ['Agrandir', 'sans-serif'],
				AgrandirGrandHeavy: ['AgrandirGrandHeavy', 'sans-serif'],
				Fredoka: ['Fredoka', 'sans-serif'],
			},
			colors: {
				yellow: '#FFE400',
				offBlack: '#181B1D',
			},
		},
	},
	plugins: [],
}
