import { ChangeActionEnum, ChangeSectionEnum, TypeProjectEnum } from '$lib/enums'
import { logger } from '$lib/trpc/middleware/logger'
import { t } from '$lib/trpc/t'
import type { Project, ProjectLog } from '$lib/types'
import z, { defaultNumber, defaultString } from '$lib/utils/zod.utils'
import delay from 'delay'

export const projects = t.router({
	create: t.procedure
		.use(logger)
		.input(
			z.object({
				userId: defaultString,
				type: z.nativeEnum(TypeProjectEnum),
				baseId: defaultNumber.optional()
			})
		)
		.mutation(async ({ input }) => {
			await delay(1000)
			const project = {
				id: new Date().getTime(),
				userId: input.userId
			}
			return project
		}),
	getByUserId: t.procedure
		.use(logger)
		.input(defaultString)
		.query(async ({ input }) => {
			await delay(1000)
			const projects: Project[] = [
				{
					id: 1,
					name: 'Test',
					type: TypeProjectEnum.BUDGET,
					month: new Date().getMonth() + 1,
					year: new Date().getFullYear(),
					totalAvailableBalance: 100000,
					totalPendingPayment: 10000,
					totalBalance: 50000,
					pendingBills: 3,
					userId: input
				},
				{
					id: 2,
					name: 'Test 2',
					type: TypeProjectEnum.BUDGET,
					month: new Date().getMonth() + 1,
					year: new Date().getFullYear(),
					totalAvailableBalance: 7000000,
					totalPendingPayment: 100000,
					totalBalance: 500000,
					pendingBills: 10,
					userId: input
				}
			]
			return projects
		}),
	receiveChanges: t.procedure
		.use(logger)
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
	getLogsByProjectId: t.procedure
		.use(logger)
		.input(defaultNumber)
		.query(async ({ input }) => {
			await delay(1000)
			const logs: ProjectLog[] = []
			for (let index = 1; index <= 5; index++) {
				logs.push({
					description: `Cambio ${index}`,
					createdAt: new Date(),
					projectId: input
				})
			}
			return logs
		}),
	delete: t.procedure
		.use(logger)
		.input(defaultNumber)
		.mutation(async ({ input }) => {
			console.log('Delete ID', input)
			await delay(1000)
			return true
		})
})
