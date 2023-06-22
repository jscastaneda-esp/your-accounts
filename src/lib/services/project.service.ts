import { trpc } from '$lib/trpc/client'
import type { Router } from '$lib/trpc/router'
import type { Change } from '$lib/types'
import type { TRPCClientInit, createTRPCClient } from 'trpc-sveltekit'

class ProjectService {
	private trpcF: ReturnType<typeof createTRPCClient<Router>>

	constructor(init: TRPCClientInit) {
		this.trpcF = trpc(init)
	}

	getLogsByProjectId(projectId: number) {
		return this.trpcF.projects.getLogsByProjectId.query(projectId)
	}

	receiveChanges(projectId: number, changes: Change<unknown>[]) {
		return this.trpcF.projects.receiveChanges.mutate({
			projectId,
			changes
		})
	}
}

export default ProjectService
