import type { BudgetBillCategory } from '$lib/enums'
import type { Budget, BudgetBill, BudgetStatistics, TotalsBills } from '$lib/types'
import { categoryTranslate } from '$utils/i18n'
import { writable } from 'svelte/store'

export function dataStore(initialValue: Budget) {
	return {
		dataS: writable<Budget>(initialValue)
	}
}

export function resumeStore(initialValue: string) {
	return {
		month: writable<string>(initialValue)
	}
}

export function availablesStore(initialValue: number) {
	return {
		totalAvailable: writable<number>(initialValue)
	}
}

export function billsDataStore(initialValue: BudgetBill[]) {
	const bills = writable<BudgetBill[]>(initialValue)

	const totals = writable<TotalsBills>({
		total: 0,
		totalPending: 0,
		totalSaving: 0,
		totalPayment: 0,
		pendingBills: 0,
		totalMaxPayment: 0
	})

	const statistics = writable<BudgetStatistics>({
		categories: [],
		data: {
			amount: [],
			payment: []
		}
	})

	bills.subscribe((value) => {
		const currentTotals = {
			total: 0,
			totalPending: 0,
			totalSaving: 0,
			totalPayment: 0,
			pendingBills: 0,
			totalMaxPayment: 0
		}

		const categoriesEnum = new Set<BudgetBillCategory>()
		const amounts: Record<string, number> = {}
		const payments: Record<string, number> = {}

		value.forEach((bill) => {
			// Calculate Statistics
			if (!categoriesEnum.has(bill.category)) {
				categoriesEnum.add(bill.category)
			}

			if (!amounts[bill.category]) {
				amounts[bill.category] = 0
			}
			amounts[bill.category] += bill.amount

			if (!payments[bill.category]) {
				payments[bill.category] = 0
			}
			payments[bill.category] += bill.payment
			// Calculate Statistics

			// Calculate Totals
			currentTotals.total += bill.amount
			currentTotals.totalPayment += bill.payment

			let pending = bill.amount - bill.payment
			if (pending < 0) {
				currentTotals.totalMaxPayment += bill.payment
			} else {
				currentTotals.totalMaxPayment += bill.amount
			}

			if (!bill.complete) {
				if (pending < 0) {
					pending = 0
				}
				currentTotals.totalPending += pending
			} else {
				currentTotals.totalSaving += pending
			}

			if (bill.amount > bill.payment && !bill.complete) {
				currentTotals.pendingBills += 1
			}
			// Calculate Totals
		})
		totals.set(currentTotals)

		const categories = [...categoriesEnum].map(categoryTranslate) as string[]
		statistics.set({
			categories,
			data: {
				amount: Object.values(amounts),
				payment: Object.values(payments)
			}
		})
	})

	return {
		bills: {
			set: bills.set
		},
		totals: {
			subscribe: totals.subscribe
		},
		statistics: {
			subscribe: statistics.subscribe
		}
	}
}
