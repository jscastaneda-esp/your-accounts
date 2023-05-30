import type { inferAsyncReturnType } from '@trpc/server'

export async function createContext() {
	return {}
}

export type Context = inferAsyncReturnType<typeof createContext>
