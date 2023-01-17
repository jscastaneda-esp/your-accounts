import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET = (async () => {
	const projects = await new Promise((resolve) => {
		setTimeout(() => {
			resolve([
				{
					id: 1,
					name: 'Test',
					type: 'BUDGET',
					month: new Date().getMonth() + 1,
					year: new Date().getFullYear(),
					totalAvailableBalance: 100000,
					totalPendingPayment: 10000,
					totalBalance: 50000,
					pendingBills: 3
				}
			]);
		}, 1000);
	});

	return json(projects);
}) satisfies RequestHandler;

export const POST = (async ({ request }) => {
	const body = await request.json();
	console.log(body);

	const project = await new Promise((resolve) => {
		setTimeout(() => {
			resolve({
				id: new Date().getTime()
			});
		}, 1000);
	});

	return json(project);
}) satisfies RequestHandler;

export const DELETE = (async ({ request }) => {
	const body = await request.json();
	console.log(body);

	await new Promise((resolve) => {
		setTimeout(() => {
			resolve({
				id: new Date().getTime()
			});
		}, 1000);
	});

	return new Response();
}) satisfies RequestHandler;
