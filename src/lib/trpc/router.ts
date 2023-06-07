import { projects } from './routes/projects'
import { budgets } from './routes/budgets'
import { t } from './t'

export const router = t.router({
	projects,
	budgets
})

export type Router = typeof router
