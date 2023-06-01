import { logger } from '$lib/trpc/middleware/logger'
import { t } from '$lib/trpc/t'
import z, { defaultString } from '$lib/utils/zod.utils'
import delay from 'delay'

export const users = t.router({
	auth: t.procedure
		.use(logger)
		.input(
			z.object({
				uuid: defaultString.min(28),
				email: z.string().email()
			})
		)
		.mutation(async ({ input }) => {
			await delay(1000)
			return `<token>${input.uuid}`
		})
})
