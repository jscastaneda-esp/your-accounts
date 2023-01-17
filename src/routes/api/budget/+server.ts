import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const PUT = (async ({ request }) => {
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
