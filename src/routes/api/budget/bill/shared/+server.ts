import type { BudgetBillShared } from '$lib/types';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET = (async ({ url }) => {
	const id = url.searchParams.get('id');
	console.log(id);

	const shared = await new Promise((resolve) => {
		setTimeout(() => {
			if (id == '1') {
				resolve([
					{
						id: 1,
						description: 'Lau',
						amount: 10000,
						budgetBillId: 1
					}
				] satisfies BudgetBillShared[]);
			} else {
				resolve([]);
			}
		}, 1000);
	});

	return json(shared);
}) satisfies RequestHandler;

export const POST = (async ({ request }) => {
	const body = await request.json();
	console.log(body);

	const shared = await new Promise((resolve) => {
		setTimeout(() => {
			resolve({
				id: new Date().getTime()
			});
		}, 1000);
	});

	return json(shared);
}) satisfies RequestHandler;
