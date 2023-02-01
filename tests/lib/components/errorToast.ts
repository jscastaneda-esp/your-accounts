import { describe, expect, it, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/svelte';
import ToastError from '../../../src/lib/components/alerts/ToastError.svelte';

describe('ErrorToast', () => {
	const message = 'Test message';

	afterEach(() => cleanup());

	it('required properties', () => {
		render(ToastError, {
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
			expect([...svg.classList.values()]).toContain('text-red-500');
		}
	});
});
