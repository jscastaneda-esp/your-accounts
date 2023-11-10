import type { inferAsyncReturnType } from '@trpc/server'
import type { RequestEvent } from '@sveltejs/kit'

export async function createContext({ locals }: RequestEvent) {
	try {
		const session = await locals.getSession()
		return { session }
	} catch {
		return {}
	}
}

export type Context = inferAsyncReturnType<typeof createContext>
