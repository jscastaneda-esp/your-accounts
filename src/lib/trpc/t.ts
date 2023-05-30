import { initTRPC } from '@trpc/server'
import type { Context } from './context'
import SuperJSON from 'superjson'

export const t = initTRPC.context<Context>().create({
	transformer: SuperJSON
})
