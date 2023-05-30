import { describe, expect, it, afterEach } from 'vitest'
import { render, screen, cleanup, fireEvent } from '@testing-library/svelte'
import ButtonExternalAuth from '../../../src/lib/components/buttons/ButtonExternalAuth.svelte'

describe('ButtonExternalAuth', () => {
	const value = 'Test'

	afterEach(() => cleanup())

	it('required properties', () => {
		render(ButtonExternalAuth, {
			props: {
				value
			}
		})

		const button = screen.getByRole('button')
		const classList = [...button.classList.values()]
		expect(classList).toContain('active:bg-gray-500')
		expect(classList).toContain('active:text-gray-200')

		const span = button.querySelector('span')
		expect(span).toBeTruthy()
		if (span) {
			expect(span.textContent).toEqual(value)
			expect([...span.classList.values()]).toContain('w-24')
		}
	})

	it('loading property', () => {
		render(ButtonExternalAuth, {
			props: {
				value,
				loading: true
			}
		})

		const button: HTMLButtonElement = screen.getByRole('button')
		expect(button.disabled).toBeTruthy()

		const span = button.querySelector('span')
		expect(span).toBeNull()

		const svg = button.querySelector('svg')
		expect(svg).toBeTruthy()
	})

	it('click event', async () => {
		const { component } = render(ButtonExternalAuth, {
			props: {
				value
			}
		})

		let clicked = false
		component.$on('click', (event) => {
			clicked = !!event.target
		})

		const button = screen.getByRole('button')
		await fireEvent.click(button)
		expect(clicked).toBeTruthy()
	})
})
