import type { BudgetBillCategory, ChangeActionEnum, ChangeSectionEnum } from './enums'

export type Log = {
	id: number
	description: string
	detail?: Record<string, unknown>
	createdAt: Date
}

export type BudgetMinimal = {
	id: number
	name: string
	year: number
	month: number
	totalAvailable: number
	totalPending: number
	totalSaving: number
	pendingBills: number
}

export type Budget = {
	id: number
	name: string
	year: number
	month: number
	fixedIncome: number
	additionalIncome: number
	availables: BudgetAvailable[]
	bills: BudgetBill[]
}

export type BudgetAvailable = {
	id: number
	name: string
	amount: number
}

export type BudgetBill = {
	id: number
	description: string
	amount: number
	payment: number
	dueDate: string | number
	complete: boolean
	category: BudgetBillCategory
}

export type BudgetStatistics = {
	categories: string[]
	data: {
		amount: number[]
		payment: number[]
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
	clear: () => void
}

export type TotalsBills = {
	total: number
	totalPending: number
	totalSaving: number
	totalPayment: number
	pendingBills: number
	totalMaxPayment: number
}
