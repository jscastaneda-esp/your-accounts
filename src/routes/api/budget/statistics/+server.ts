import type { BudgetStatistics } from '$lib/types';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET = (async ({ url }) => {
	const id = url.searchParams.get('id');
	console.log(id);

	const statistics = await new Promise((resolve) => {
		setTimeout(() => {
			resolve({
				labels: ['PERSONAL', 'CASA', 'AHORRO', 'FINANCIERO', 'IMPUESTOS', 'OTROS'],
				pie: {
					data: [10, 20.5, 5, 50, 6.5, 80]
				},
				bar: {
					amount: {
						data: [12, 19, 3, 5, 2, 3]
					},
					payment: {
						data: [0, -19, 1, 4, 0, 4]
					}
				}
			} satisfies BudgetStatistics);
		}, 1000);
	});

	return json(statistics);
}) satisfies RequestHandler;
