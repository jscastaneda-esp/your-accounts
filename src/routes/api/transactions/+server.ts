import type { ProjectTransaction } from '$lib/types';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET = (async ({ url }) => {
	const id = url.searchParams.get('id');
	console.log(id);

	const transactions = await new Promise((resolve) => {
		setTimeout(() => {
			const transactions: ProjectTransaction[] = [];
			for (let index = 1; index <= 5; index++) {
				transactions.push({
					description: `Cambio ${index}`,
					createdAt: new Date()
				});
			}

			resolve(transactions);
		}, 1000);
	});

	return json(transactions);
}) satisfies RequestHandler;
