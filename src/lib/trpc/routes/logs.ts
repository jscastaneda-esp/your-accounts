import { t } from '../t'
import type { Log } from '$lib/types'
import z, { defaultNumber } from '$utils/zod.utils'
import delay from 'delay'
import { procedure } from '../middleware'
import { CodeLogEnum } from '$lib/enums'

export const logs = t.router({
	getLogsByResourceId: procedure
		.input(
			z.object({
				resourceId: defaultNumber,
				code: z.nativeEnum(CodeLogEnum)
			})
		)
		.query(async ({ input }) => {
			await delay(1000)
			const logs: Log[] = []
			for (let index = 1; index <= 10; index++) {
				const createdAt = new Date()
				if (index > 8) {
					createdAt.setMonth(createdAt.getMonth() - index)
				} else if (index > 5) {
					createdAt.setDate(createdAt.getDate() - index)
				} else if (index > 3) {
					createdAt.setHours(createdAt.getHours() - index)
				} else {
					createdAt.setSeconds(createdAt.getSeconds() - 10)
					createdAt.setMinutes(createdAt.getMinutes() - index + 1)
				}

				const detail: Record<string, unknown> = {}
				if (CodeLogEnum.BUDGET_BILL === input.code) {
					detail.amount = (index % 2 == 0 ? index * -1 : index) * 1000
				}

				logs.push({
					id: index,
					description: `Cambio ${index}`,
					detail,
					createdAt
				})
			}
			return logs
		})
})
