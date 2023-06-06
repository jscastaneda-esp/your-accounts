import type { PageServerLoad } from './$types'
import { router } from '$lib/trpc/router'
import { createContext } from '$lib/trpc/context'

export const load: PageServerLoad = async (event) =>
	router.createCaller(await createContext(event)).budgets.getById(Number(event.params.id))
