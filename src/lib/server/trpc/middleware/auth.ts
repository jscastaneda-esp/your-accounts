import { TRPCError } from '@trpc/server'
import { t } from '../t'

export const auth = t.middleware(async ({ next, ctx }) => {
	if (!ctx.session) {
		throw new TRPCError({ code: 'UNAUTHORIZED' })
	}

	return next()
})
