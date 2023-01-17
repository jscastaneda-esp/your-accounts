import type { Budget } from '$lib/interfaces/Budget';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	console.log(params);

	const budget = await new Promise((resolve) => {
		setTimeout(() => {
			resolve({
				id: Number(params.id),
				name: 'Test',
				year: new Date().getFullYear(),
				month: new Date().getMonth() + 1,
				fixedIncome: 6370000,
				additionalIncome: 0,
				totalBalance: 6370000,
				total: 0,
				estimatedBalance: 6370000,
				availableBalances: [
					{
						id: 1,
						name: 'Cuenta Ahorros',
						amount: 6370000,
						budgetId: Number(params.id)
					}
				]
			} satisfies Budget);
		}, 1000);
	});

	return budget;
}) satisfies PageServerLoad;
