import type {
	ChangeActionEnum,
	ChangeSectionEnum,
	TypeAuthEnum,
	TypeProjectEnum,
	UserManagementActionsEnum
} from './enums';

export type ConfirmPopupInfo<D = null> = {
	show: boolean;
	question: string;
	description?: string;
	detail?: D;
};

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
};

export type BudgetAvailable = {
	id: number;
	name: string;
	amount: number;
	budgetId: number;
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
};

export type CategoryBill = {
	id: number;
	name: string;
	color: string;
};

export type BudgetBillShared = {
	id?: number;
	description: string;
	amount: number;
	budget_bill_id: number;
};

export type FelteError = string[] | null;

export type EventDispatchProject = {
	readonly id: number;
	readonly name: string;
	readonly type: TypeProjectEnum;
};

export type Change = {
	index?: number;
	readonly section: ChangeSectionEnum;
	readonly action: ChangeActionEnum;
	detail: { id: number } & Record<string, unknown>;
};
