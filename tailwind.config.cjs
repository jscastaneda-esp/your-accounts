/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	plugins: [require('daisyui')],
	daisyui: {
		themes: [
			{
				mytheme: {
					primary: '#f28c18',
					'primary-content': '#131616',
					secondary: '#a33f1b',
					accent: '#e2e063',
					'accent-content': '#626262',
					neutral: '#2F1B05',
					'base-100': '#212121',
					info: '#2563eb',
					success: '#16a34a',
					warning: '#d97706',
					error: '#dc2626'
				}
			}
		]
	}
}
