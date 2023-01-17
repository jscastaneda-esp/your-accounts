import type { BudgetAvailable } from '$lib/types';

export interface BaseBudget {
	id: number;
	name: string;
	year: number;
	month: number;
	fixedIncome: number;
	additionalIncome: number;
	totalBalance: number;
	total: number;
	estimatedBalance: number;
}

export interface Budget extends BaseBudget {
	availableBalances: BudgetAvailable[];
}
