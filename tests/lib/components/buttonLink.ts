import { describe, expect, it, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/svelte';
import ButtonLink from '../../../src/lib/components/ButtonLink.svelte';

describe('ButtonLink', () => {
	const text = 'Test';
	const href = '/test';

	afterEach(() => cleanup());

	it('required properties', () => {
		render(ButtonLink, {
			props: {
				text,
				href
			}
		});

		const link: HTMLAnchorElement = screen.getByRole('link');
		expect(link.href).toContain(href);

		const span = link.querySelector('span');
		expect(span).toBeTruthy();
		if (span) {
			expect(span.textContent).toEqual(text);
		}
	});

	it('class properties', () => {
		const className = 'test';

		render(ButtonLink, {
			props: {
				text,
				href,
				className
			}
		});

		const link = screen.getByRole('link');
		expect([...link.classList.values()]).toContain(className);
	});

	it('disabled property', () => {
		render(ButtonLink, {
			props: {
				text,
				href,
				disabled: true
			}
		});

		const link: HTMLAnchorElement = screen.getByRole('link');
		expect([...link.classList.values()]).toContain('pointer-events-none');
	});

	it('click event', async () => {
		const { component } = render(ButtonLink, {
			props: {
				text,
				href
			}
		});

		let clicked = false;
		component.$on('click', (event) => {
			event.preventDefault();
			clicked = !!event.target;
		});

		const link = screen.getByRole('link');
		await fireEvent.click(link);
		expect(clicked).toBeTruthy();
	});
});
