import { describe, expect, it, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/svelte';
import Input from '../../../src/lib/components/Input.svelte';

vi.stubGlobal('crypto', {
	randomUUID: vi.fn()
});

describe('Input', () => {
	const id = 'test';
	const name = 'test';
	const placeholder = 'Test';

	afterEach(() => {
		cleanup();
		vi.clearAllMocks();
	});

	it('required properties', () => {
		render(Input, {
			props: {
				id,
				name,
				placeholder
			}
		});

		const group = screen.getByRole('group');
		const label: HTMLLabelElement | null = group.querySelector('label');
		expect(label).toBeTruthy();
		if (label) {
			expect(label.htmlFor).toContain(id);

			const input: HTMLInputElement | null = label.querySelector('input');
			expect(input).toBeTruthy();
			if (input) {
				expect(input.id).toContain(id);
				expect(input.name).toEqual(name);
				expect(input.placeholder).toEqual(placeholder);
			}

			const span = label.querySelector('span');
			expect(span).toBeTruthy();
			if (span) {
				expect(span.textContent).toEqual(placeholder);
			}
		}
	});

	it('type property', () => {
		const type = 'email';

		render(Input, {
			props: {
				id,
				name,
				placeholder,
				type
			}
		});

		const group = screen.getByRole('group');
		const label: HTMLLabelElement | null = group.querySelector('label');
		expect(label).toBeTruthy();
		if (label) {
			const input: HTMLInputElement | null = label.querySelector('input');
			expect(input).toBeTruthy();
			if (input) {
				expect(input.type).toContain(type);
			}
		}
	});

	it('class properties', () => {
		const classInput = 'test';

		render(Input, {
			props: {
				id,
				name,
				placeholder,
				classInput
			}
		});

		const group = screen.getByRole('group');
		const label: HTMLLabelElement | null = group.querySelector('label');
		expect(label).toBeTruthy();
		if (label) {
			const input: HTMLInputElement | null = label.querySelector('input');
			expect(input).toBeTruthy();
			if (input) {
				expect([...input.classList.values()]).toContain(classInput);
			}
		}
	});

	it('disabled property', () => {
		render(Input, {
			props: {
				id,
				name,
				placeholder,
				disabled: true
			}
		});

		const group: HTMLFieldSetElement = screen.getByRole('group');
		expect(group.disabled).toBeTruthy();
	});

	it('errors property', () => {
		const errors = ['Error in the field'];

		render(Input, {
			props: {
				id,
				name,
				placeholder,
				errors
			}
		});

		const group = screen.getByRole('group');
		const alert = group.querySelector('div');
		expect(alert).toBeTruthy();
		if (alert) {
			const span = alert.querySelector('span');
			expect(span).toBeTruthy();
			if (span) {
				expect(span.textContent).toEqual(errors[0]);
			}
		}
	});
});
