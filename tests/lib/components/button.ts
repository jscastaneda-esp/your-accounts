import { describe, expect, it, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/svelte';
import Button from '../../../src/lib/components/Button.svelte';

describe('Button', () => {
	const value = 'Test';

	afterEach(() => cleanup());

	it('required properties', () => {
		render(Button, {
			props: {
				value
			}
		});

		const button = screen.getByRole('button');
		const span = button.querySelector('span');
		expect(span).toBeTruthy();
		if (span) {
			expect(span.textContent).toEqual(value);
		}
	});

	it('type property', () => {
		const type = 'submit';

		render(Button, {
			props: {
				type,
				value
			}
		});

		const button: HTMLButtonElement = screen.getByRole('button');
		expect(button.type).toEqual(type);
	});

	it('class properties', () => {
		const className = 'test';
		const classNameValue = 'test-value';

		render(Button, {
			props: {
				value,
				className,
				classNameValue
			}
		});

		const button = screen.getByRole('button');
		expect([...button.classList.values()]).toContain(className);

		const span = button.querySelector('span');
		expect(span).toBeTruthy();
		if (span) {
			expect([...span.classList.values()]).toContain(classNameValue);
		}
	});

	it('disabled property', () => {
		render(Button, {
			props: {
				value,
				disabled: true
			}
		});

		const button: HTMLButtonElement = screen.getByRole('button');
		expect(button.disabled).toBeTruthy();

		const span = button.querySelector('span');
		expect(span).toBeTruthy();
	});

	it('loading property', () => {
		render(Button, {
			props: {
				value,
				loading: true
			}
		});

		const button: HTMLButtonElement = screen.getByRole('button');
		expect(button.disabled).toBeTruthy();

		const span = button.querySelector('span');
		expect(span).toBeNull();

		const svg = button.querySelector('svg');
		expect(svg).toBeTruthy();
	});

	it('click event', async () => {
		const { component } = render(Button, {
			props: {
				value
			}
		});

		let clicked = false;
		component.$on('click', (event) => {
			clicked = !!event.target;
		});

		const button = screen.getByRole('button');
		await fireEvent.click(button);
		expect(clicked).toBeTruthy();
	});
});
