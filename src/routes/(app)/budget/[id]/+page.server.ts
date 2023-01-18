import type { Budget } from '$lib/types';
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
				],
				bills: [
					{
						id: 1,
						description: 'Pagos financieros',
						amount: 1000000,
						payment: 0,
						shared: true,
						dueDate: '10',
						complete: false,
						budgetId: Number(params.id),
						categoryId: '4'
					},
					{
						id: 2,
						description: 'Pagos personales',
						amount: 2000000,
						payment: 0,
						shared: false,
						dueDate: '',
						complete: false,
						budgetId: Number(params.id),
						categoryId: '1'
					}
				]
			} satisfies Budget);
		}, 1000);
	});

	return budget;
}) satisfies PageServerLoad;
