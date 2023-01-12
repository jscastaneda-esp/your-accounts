import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const projects = await new Promise((resolve) => {
		setTimeout(() => {
			resolve([]);
		}, 1000);
	});

	return json(projects);
};
