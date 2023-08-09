import { trpc } from '$lib/trpc/client'
import type { Router } from '$lib/trpc/router'
import type { Change } from '$lib/types'
import type { TRPCClientInit, createTRPCClient } from 'trpc-sveltekit'

class LogService {
	private trpcF: ReturnType<typeof createTRPCClient<Router>>

	constructor(init: TRPCClientInit) {
		this.trpcF = trpc(init)
	}

	getLogsByResourceId(projectId: number) {
		return this.trpcF.logs.getLogsByResourceId.query(projectId)
	}

	receiveChanges(resourceId: number, changes: Change<unknown>[]) {
		return this.trpcF.logs.receiveChanges.mutate({
			resourceId,
			changes
		})
	}
}

export default LogService
