import { projects } from './routes/projects';
import { budgets } from './routes/budgets';
import { t } from './t';
import { transactions } from './routes/transactions';

export const router = t.router({
	projects,
	budgets,
	transactions
});

export type Router = typeof router;
