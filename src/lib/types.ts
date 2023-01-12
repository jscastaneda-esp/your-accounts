import type { TypeAuthEnum, UserManagementActionsEnum } from './enums';

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

export type BudgetMainData = {
	id: number;
	name: string;
	month: string;
	fixed_income: number;
	additional_income: number;
};

export type BudgetContext = {
	data: Record<string, unknown>;
	isValid: boolean;
};

export type BudgetAvailable = {
	id?: number;
	name: string;
	amount: number;
	budget_id: number;
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

export type FelteOptionalError = FelteError | undefined;
