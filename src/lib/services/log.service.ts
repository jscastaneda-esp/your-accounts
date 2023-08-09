import { trpc } from '$lib/trpc/client'
import type { Router } from '$lib/trpc/router'
import type { TRPCClientInit, createTRPCClient } from 'trpc-sveltekit'

class LogService {
	private trpcF: ReturnType<typeof createTRPCClient<Router>>

	constructor(init: TRPCClientInit) {
		this.trpcF = trpc(init)
	}

	getLogsByResourceId(projectId: number) {
		return this.trpcF.logs.getLogsByResourceId.query(projectId)
	}
}

export default LogService
