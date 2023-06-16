import type { BudgetBill, TotalsBills } from '$lib/types'
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

	bills.subscribe((value) => {
		const currentTotals = {
			totalPending: 0,
			pendingBills: 0,
			totalPayment: 0,
			total: 0,
			totalMaxPayment: 0,
			totalSavings: 0
		}

		value.forEach((bill) => {
			currentTotals.total += bill.amount
			currentTotals.totalPayment += bill.payment

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
	})

	return {
		bills: {
			set: bills.set
		},
		totals: {
			subscribe: totals.subscribe
		}
	}
}
