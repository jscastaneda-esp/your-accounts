import { t } from '../t'
import type { Log } from '$lib/types'
import { defaultNumber } from '$utils/zod.utils'
import delay from 'delay'
import { procedure } from '../middleware'

export const logs = t.router({
	getLogsByResourceId: procedure.input(defaultNumber).query(async () => {
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

			logs.push({
				id: index,
				description: `Cambio ${index}`,
				createdAt: createdAt
			})
		}
		return logs
	})
})
