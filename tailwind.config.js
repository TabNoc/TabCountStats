/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/**/*.{vue,js,ts,jsx,tsx,html}',
		'node_modules/flowbite-vue/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {},
	},
	plugins: [require('flowbite/plugin')],
	darkMode: 'media',
};
