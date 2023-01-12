import type { CategoryBill } from '$lib/types';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const categories = await new Promise((resolve) => {
		const types = [
			{ type: 'PERSONAL', color: '#f59e0b' },
			{ type: 'CASA', color: '#6366f1' },
			{ type: 'AHORRO', color: '#22c55e' },
			{ type: 'FINANCIERO', color: '#0ea5e9' },
			{ type: 'IMPUESTOS', color: '#ef4444' },
			{ type: 'OTROS', color: '#737373' }
		];

		const list: CategoryBill[] = [];
		for (let i = 0; i < types.length; i++) {
			list.push({
				id: i + 1,
				name: types[i].type,
				color: types[i].color
			});
		}

		setTimeout(() => {
			resolve(list);
		}, 1000);
	});

	return json(categories);
};
