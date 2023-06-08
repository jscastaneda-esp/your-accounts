import { t } from './t'
import { logger } from './middleware/logger'
import { auth } from './middleware/auth'

export const procedure = t.procedure.use(logger).use(auth)
