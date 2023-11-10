import { t } from '../t'
import { logger } from './logger'
import { auth } from './auth'

export const procedure = t.procedure.use(logger).use(auth)
export const publicProcedure = t.procedure.use(logger)
