import type { RequestHandler } from './$types';

export const PUT = (async ({ request }) => {
	const body = await request.json();
	console.log(body);

	await new Promise<void>((resolve) => {
		setTimeout(() => {
			resolve();
		}, 1000);
	});

	return new Response();
}) satisfies RequestHandler;
