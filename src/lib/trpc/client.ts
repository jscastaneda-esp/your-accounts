import type { Router } from './router'
import { createTRPCClient, type TRPCClientInit } from 'trpc-sveltekit'
import SuperJSON from 'superjson'

let browserClient: ReturnType<typeof createTRPCClient<Router>>

export function trpc(init?: TRPCClientInit) {
	if (typeof window === 'undefined') {
		return createTRPCClient<Router>({ init, transformer: SuperJSON })
	}
	if (!browserClient) browserClient = createTRPCClient<Router>({ transformer: SuperJSON })
	return browserClient
}
