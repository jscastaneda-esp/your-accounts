import { users } from './routes/users'
import { projects } from './routes/projects'
import { budgets } from './routes/budgets'
import { t } from './t'

export const router = t.router({
	users,
	projects,
	budgets
})

export type Router = typeof router
