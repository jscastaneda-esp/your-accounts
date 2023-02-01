import type { BudgetBillTransaction } from '$lib/types';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET = (async ({ url }) => {
	const id = url.searchParams.get('id');
	console.log(id);

	const transactions = await new Promise((resolve) => {
		setTimeout(() => {
			const transactions: BudgetBillTransaction[] = [];
			for (let index = 1; index <= 4; index++) {
				transactions.push({
					description: `Compra ${index}`,
					amount: (index % 2 == 0 ? index * -1 : index) * 1000,
					createdAt: new Date()
				});
			}

			resolve(transactions);
		}, 1000);
	});

	return json(transactions);
}) satisfies RequestHandler;

export const POST = (async ({ request }) => {
	const body = await request.json();
	console.log(body);

	await new Promise<void>((resolve) => {
		setTimeout(() => {
			resolve();
		}, 1000);
	});

	return new Response();
}) satisfies RequestHandler;
