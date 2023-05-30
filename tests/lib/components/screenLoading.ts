import { describe, expect, it, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/svelte'
import ScreenLoading from '../../../src/lib/components/ScreenLoading.svelte'

describe('ScreenLoading', () => {
	afterEach(() => cleanup())

	it('general', () => {
		render(ScreenLoading)

		const main = screen.getByRole('main')
		const svg = main.querySelector('svg')
		expect(svg).toBeTruthy()
		if (svg) {
			expect([...svg.classList.values()]).toContain('text-white')
		}
	})
})
