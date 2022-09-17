import { describe, expect, it, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/svelte';
import DefaultToast from '../../../src/lib/components/DefaultToast.svelte';

describe('DefaultToast', () => {
	const message = 'Test message';

	afterEach(() => cleanup());

	it('required properties', () => {
		render(DefaultToast, {
			props: {
				message
			}
		});

		const alert = screen.getByRole('alert');
		const strong = alert.querySelector('strong');
		expect(strong).toBeTruthy();
		if (strong) {
			expect(strong.textContent).toEqual(message);
		}

		const svg = alert.querySelector('svg');
		expect(svg).toBeTruthy();
		if (svg) {
			expect([...svg.classList.values()]).toContain('text-sky-500');
		}
	});
});
