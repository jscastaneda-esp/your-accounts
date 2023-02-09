import type {
	ChangeActionEnum,
	ChangeSectionEnum,
	TypeAuthEnum,
	TypeProjectEnum,
	UserManagementActionsEnum
} from './enums';

export type PageDataAuth = {
	type: TypeAuthEnum;
};

export type PageDataUserManagementAction = {
	mode: UserManagementActionsEnum;
	actionCode: string;
};

export type Project = {
	id: number;
	name: string;
	type: TypeProjectEnum;
	month?: number;
	year?: number;
	totalAvailableBalance?: number;
	totalPendingPayment?: number;
	totalBalance?: number;
	pendingBills?: number;
	userId: string;
};

export type ProjectTransaction = {
	description: string;
	createdAt: Date;
	projectId: number;
};

export type Budget = {
	id: number;
	name: string;
	year: number;
	month: number;
	fixedIncome: number;
	additionalIncome: number;
	totalBalance: number;
	total: number;
	estimatedBalance: number;
	availableBalances: BudgetAvailable[];
	bills: BudgetBill[];
	projectId: number;
};

export type BudgetAvailable = {
	id: number;
	name: string;
	amount: number;
	budgetId: number;
};

export type CategoryBill = {
	id: number;
	name: string;
	color: string;
};

export type BudgetBill = {
	id: number;
	description: string;
	amount: number;
	payment: number;
	shared: boolean;
	dueDate: string | number;
	complete: boolean;
	budgetId: number;
	categoryId: string | number;
	totalShared: number;
};

export type BudgetBillTransaction = {
	description: string;
	amount: number;
	createdAt: Date;
	budgetBillId: number;
};

export type BudgetBillShared = {
	id: number;
	description: string;
	amount: number;
	budgetBillId: number;
};

export type BudgetStatistics = {
	labels: string[];
	pie: {
		data: number[];
	};
	bar: {
		amount: {
			data: number[];
		};
		payment: {
			data: number[];
		};
	};
};

export type FelteError = string[] | null;

export type EventDispatchProject = {
	readonly id: number;
	readonly name: string;
	readonly type: TypeProjectEnum;
};

export type Change<T> = {
	index?: number;
	readonly section: ChangeSectionEnum;
	readonly action: ChangeActionEnum;
	detail: { id: number } & T;
};
