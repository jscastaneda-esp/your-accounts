import type { LayoutServerLoad } from './$types'
import { createCaller } from '$lib/server/trpc/routes'
import { createContext } from '$lib/server/trpc/context'
import { redirect } from '@sveltejs/kit'
import { trytm } from '@bdsqqq/try'

export const load: LayoutServerLoad = async (event) => {
	const [response, error] = await trytm(
		createCaller(await createContext(event)).budgets.getById(Number(event.params.id))
	)
	if (error) {
		console.log(error)
		throw redirect(302, '/login')
	}

	return response
}
