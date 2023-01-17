import type { TypeAuthEnum, TypeProjectEnum, UserManagementActionsEnum } from './enums';

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

export type BudgetAvailable = {
	id?: number;
	name: string;
	amount: number;
	budgetId: number;
};

export type BudgetBill = {
	id?: number;
	description: string;
	amount: number;
	payment: number;
	shared: boolean;
	due_date: number | string;
	complete: boolean;
	budget_id: number;
	category_id: number | string;
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
	id: number;
	name: string;
	type: TypeProjectEnum;
};
