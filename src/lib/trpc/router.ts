import { t } from './t'
import { logs } from './routes/logs'
import { budgets } from './routes/budgets'

export const router = t.router({
	logs,
	budgets
})

export type Router = typeof router
