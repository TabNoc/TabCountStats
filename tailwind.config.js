/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/**/*.{vue,js,ts,jsx,tsx,html}',
		'./node_modules/flowbite/**/*.js'],
	theme: {
		extend: {},
	},
	plugins: [require('flowbite/plugin')],
	darkMode: 'media',
};
