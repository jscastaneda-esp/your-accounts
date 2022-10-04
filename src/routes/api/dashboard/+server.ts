import { TypeProject } from '$lib/enums/TypeProject.enum';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const projects = await new Promise((resolve) => {
		setTimeout(() => {
			const projects = [];
			for (let i = 1; i <= 10; i++) {
				projects.push({
					id: i,
					name: 'Presupuesto',
					type: TypeProject.BUDGET,
					year: 2022,
					month: i,
					totalAvailableBalance: 100000,
					totalPendingPayment: 1000000,
					totalBalance: -900000,
					pendingBills: 3
				});
			}

			resolve(projects);
		}, 1000);
	});

	return json(projects);
};
