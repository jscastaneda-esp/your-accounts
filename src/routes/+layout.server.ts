import { redirect } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals, url }) => {
	const session = await locals.getSession()

	if (url.pathname.startsWith('/login') || url.pathname === '/') {
		if (session) {
			throw redirect(303, '/budget')
		}
	}

	if (!session && !url.pathname.startsWith('/login')) {
		throw redirect(303, '/login')
	}

	return {
		session
	}
}
