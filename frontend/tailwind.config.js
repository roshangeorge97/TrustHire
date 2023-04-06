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
				yellow: '#F5B82E',
				offBlack: '#181B1D',
				blue:'#0D00A4',
			},
		},
	},
	plugins: [],
}
