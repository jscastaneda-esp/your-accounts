import type { PageServerLoad } from './$types'
import { router } from '$lib/trpc/router'
import { createContext } from '$lib/trpc/context'
import { redirect } from '@sveltejs/kit'

export const load: PageServerLoad = async (event) => {
	try {
		const response = await router
			.createCaller(await createContext(event))
			.budgets.getById(Number(event.params.id))
		return response
	} catch (e: unknown) {
		console.log(e)
		throw redirect(302, '/login')
	}
}
