import type { BudgetBillCategory, ChangeActionEnum, ChangeSectionEnum } from './enums'

export type ProjectLog = {
	id: number
	description: string
	createdAt: Date
}

export type BudgetMinimal = {
	id: number
	name: string
	year: number
	month: number
	totalAvailableBalance: number
	totalPendingPayment: number
	totalBalance: number
	pendingBills: number
}

export type Budget = {
	id: number
	name: string
	year: number
	month: number
	fixedIncome: number
	additionalIncome: number
	availableBalances: BudgetAvailable[]
	bills: BudgetBill[]
	projectId: number
}

export type BudgetAvailable = {
	id: number
	name: string
	amount: number
	budgetId: number
}

export type BudgetBill = {
	id: number
	description: string
	amount: number
	payment: number
	shared: boolean
	dueDate: string | number
	complete: boolean
	budgetId: number
	category: BudgetBillCategory
	totalShared: number
}

export type BudgetBillTransaction = {
	description: string
	amount: number
	createdAt: Date
	budgetBillId: number
}

export type BudgetBillShared = {
	id: number
	description: string
	amount: number
	budgetBillId: number
}

export type BudgetStatistics = {
	categories: string[]
	amount: {
		data: number[]
	}
	payment: {
		data: number[]
	}
}

export type FelteError = string[] | null

export type Change<T> = {
	index?: number
	readonly section: ChangeSectionEnum
	readonly action: ChangeActionEnum
	detail: { id: number } & T
}

export type ChangeStore<T> = {
	add: (newChange: Change<T>) => void
	revert: (newChanges: Change<T>[]) => void
	delete: (delChanges: Change<T>[]) => void
}

export type TotalsBills = {
	totalPending: number
	pendingBills: number
	totalPayment: number
	total: number
	totalMaxPayment: number
	totalSavings: number
}
