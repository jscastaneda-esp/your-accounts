import type { BudgetBillCategory } from '$lib/enums'
import type { BudgetBill, BudgetStatistics, TotalsBills } from '$lib/types'
import { categoryTranslate } from '$utils/i18n'
import { writable } from 'svelte/store'

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
		totalPending: 0,
		pendingBills: 0,
		totalPayment: 0,
		total: 0,
		totalMaxPayment: 0,
		totalSavings: 0
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
			totalPending: 0,
			pendingBills: 0,
			totalPayment: 0,
			total: 0,
			totalMaxPayment: 0,
			totalSavings: 0
		}

		const categoriesEnum = new Set<BudgetBillCategory>()
		const amounts: Record<string, number> = {}
		const payments: Record<string, number> = {}

		value.forEach((bill) => {
			currentTotals.total += bill.amount
			currentTotals.totalPayment += bill.payment

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

			const pending = bill.amount - bill.payment
			if (!bill.complete) {
				currentTotals.totalPending += pending
			} else {
				currentTotals.totalSavings += pending
			}

			if (bill.amount > bill.payment && !bill.complete) {
				currentTotals.pendingBills += 1
			}

			if (bill.amount < bill.payment) {
				let isTotalPayment = true
				if (bill.shared) {
					if (pending < 0) {
						currentTotals.totalMaxPayment += bill.payment + pending
						isTotalPayment = false
					}
				}

				if (isTotalPayment) {
					currentTotals.totalMaxPayment += bill.payment
				}
			} else {
				currentTotals.totalMaxPayment += bill.amount
			}
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
