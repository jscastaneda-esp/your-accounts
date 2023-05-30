import { describe, expect, it, afterEach, vi } from 'vitest'
import { render, screen, cleanup, fireEvent } from '@testing-library/svelte'
import InputPassword from '../../../src/lib/components/inputs/InputPassword.svelte'

vi.stubGlobal('crypto', {
	randomUUID: vi.fn()
})

describe('PasswordInput', () => {
	const id = 'test'
	const name = 'test'
	const placeholder = 'Test'

	afterEach(() => {
		cleanup()
		vi.clearAllMocks()
	})

	it('required properties', () => {
		render(InputPassword, {
			props: {
				id,
				name,
				placeholder
			}
		})

		const group = screen.getByRole('group')
		const label: HTMLLabelElement | null = group.querySelector('label')
		expect(label).toBeTruthy()
		if (label) {
			expect(label.htmlFor).toContain(id)

			const input: HTMLInputElement | null = label.querySelector('input')
			expect(input).toBeTruthy()
			if (input) {
				expect(input.id).toContain(id)
				expect(input.name).toEqual(name)
				expect(input.placeholder).toEqual(placeholder)
			}

			const span = label.querySelector('span')
			expect(span).toBeTruthy()
			if (span) {
				expect(span.textContent).toEqual(placeholder)
			}

			const button = label.querySelector('button')
			expect(button).toBeTruthy()
			if (button) {
				const i = button.querySelector('i')
				expect(i).toBeTruthy()
				if (i) {
					expect([...i.classList.values()]).toContain('fa-eye')
				}
			}
		}
	})

	it('disabled property', () => {
		render(InputPassword, {
			props: {
				id,
				name,
				placeholder,
				disabled: true
			}
		})

		const group: HTMLFieldSetElement = screen.getByRole('group')
		expect(group.disabled).toBeTruthy()
	})

	it('errors property', () => {
		const errors = ['Error in the field']

		render(InputPassword, {
			props: {
				id,
				name,
				placeholder,
				errors
			}
		})

		const group = screen.getByRole('group')
		const alert = group.querySelector('div')
		expect(alert).toBeTruthy()
		if (alert) {
			const span = alert.querySelector('span')
			expect(span).toBeTruthy()
			if (span) {
				expect(span.textContent).toEqual(errors[0])
			}
		}
	})

	it('show password', async () => {
		render(InputPassword, {
			props: {
				id,
				name,
				placeholder
			}
		})

		const group = screen.getByRole('group')
		const label: HTMLLabelElement | null = group.querySelector('label')
		expect(label).toBeTruthy()
		if (label) {
			const button = label.querySelector('button')
			expect(button).toBeTruthy()
			if (button) {
				const i = button.querySelector('i')
				expect(i).toBeTruthy()

				const input: HTMLInputElement | null = label.querySelector('input')
				expect(input).toBeTruthy()
				if (i && input) {
					expect([...i.classList.values()]).toContain('fa-eye')
					expect(input.type).toEqual('password')

					await fireEvent.click(button)

					expect([...i.classList.values()]).toContain('fa-eye-slash')
					expect(input.type).toEqual('text')
				}
			}
		}
	})
})
