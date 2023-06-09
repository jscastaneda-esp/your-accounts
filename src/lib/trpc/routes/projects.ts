import { ChangeActionEnum, ChangeSectionEnum } from '$lib/enums'
import { t } from '../t'
import type { ProjectLog } from '$lib/types'
import z, { defaultNumber } from '$utils/zod.utils'
import delay from 'delay'
import { procedure } from '../middleware'

export const projects = t.router({
	receiveChanges: procedure
		.input(
			z.object({
				projectId: z.number(),
				changes: z.array(
					z.object({
						index: z.number().optional(),
						section: z.nativeEnum(ChangeSectionEnum),
						action: z.nativeEnum(ChangeActionEnum),
						detail: z
							.object({
								id: z.number()
							})
							.and(z.record(z.unknown()))
					})
				)
			})
		)
		.mutation(async ({ input }) => {
			console.log('Receive changes', input)
			await delay(1000)
			return true
		}),
	getLogsByProjectId: procedure.input(defaultNumber).query(async () => {
		await delay(1000)
		const logs: ProjectLog[] = []
		for (let index = 1; index <= 5; index++) {
			logs.push({
				id: index,
				description: `Cambio ${index}`,
				createdAt: new Date()
			})
		}
		return logs
	})
})
