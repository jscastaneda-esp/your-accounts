import { describe, expect, it, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/svelte';
import SuccessToast from '../../../src/lib/components/SuccessToast.svelte';

describe('SuccessToast', () => {
	const message = 'Test message';

	afterEach(() => cleanup());

	it('required properties', () => {
		render(SuccessToast, {
			props: {
				message
			}
		});

		const alert = screen.getByRole('alert');
		const span = alert.querySelector('span');
		expect(span).toBeTruthy();
		if (span) {
			expect(span.textContent).toEqual(message);
		}

		const svg = alert.querySelector('svg');
		expect(svg).toBeTruthy();
		if (svg) {
			expect([...svg.classList.values()]).toContain('text-green-500');
		}
	});
});
