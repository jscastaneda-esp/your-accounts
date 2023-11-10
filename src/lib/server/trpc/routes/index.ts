import { t } from '../t'
import { users } from './users'
import { logs } from './logs'
import { budgets } from './budgets'

export const router = t.router({
	users,
	logs,
	budgets
})

export type Router = typeof router
