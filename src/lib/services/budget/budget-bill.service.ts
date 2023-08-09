import ChangeUtil from '$lib/classes/ChangeUtil'
import { BudgetBillCategory, ChangeActionEnum, ChangeSectionEnum } from '$lib/enums'
import { trpc } from '$lib/trpc/client'
import type { Router } from '$lib/trpc/router'
import type { BudgetBill, Change, ChangeStore, FelteError } from '$lib/types'
import type { Readable } from 'svelte/store'
import type { TRPCClientInit, createTRPCClient } from 'trpc-sveltekit'

type ChangeBill = {
	description?: string
	amount?: number
	payment?: number
	shared?: boolean
	dueDate?: string | number
	complete?: boolean
	category?: string
	totalShared?: number
}

class BudgetBillService {
	private trpcF: ReturnType<typeof createTRPCClient<Router>>
	private changeUtil: ChangeUtil<keyof ChangeBill>

	constructor(
		init: TRPCClientInit,
		private changes?: Readable<Change<unknown>[]> & ChangeStore<unknown>
	) {
		this.trpcF = trpc(init)
		this.changeUtil = new ChangeUtil<keyof ChangeBill>()
	}

	async create(description: string, budgetId: number) {
		const request = {
			description,
			budgetId
		}
		const { id } = await this.trpcF.budgets.bills.create.mutate(request)
		return {
			id,
			amount: 0,
			payment: 0,
			shared: false,
			dueDate: '',
			complete: false,
			category: null as unknown as BudgetBillCategory,
			totalShared: 0,
			...request
		}
	}

	async createTransaction(
		description: string,
		amount: number,
		operation: '+' | '-',
		billId: number,
		cb: (value: number) => void
	) {
		let value: number = amount
		if (operation == '-') value *= -1

		await this.trpcF.budgets.bills.createTransaction.mutate({
			description: description,
			amount: value,
			billId
		})

		cb(value)
	}

	getTransactionsById(id: number) {
		return this.trpcF.budgets.bills.getTransactionsById.query(id)
	}

	compareData(
		newDatas: BudgetBill[],
		dataErrors: {
			id: FelteError
			description: FelteError
			amount: FelteError
			payment: FelteError
			shared: FelteError
			dueDate: FelteError
			complete: FelteError
			category: FelteError
			totalShared: FelteError
		}[],
		list: BudgetBill[]
	) {
		if (this.changes) {
			const changeBase = {
				section: ChangeSectionEnum.BUDGET_BILL,
				action: ChangeActionEnum.UPDATE
			}
			dataErrors = dataErrors || []

			if (newDatas.length != list.length) {
				const deletes = list.filter((bill) => !newDatas.some((item) => item.id == bill.id))
				const newList = list.filter((bill) => newDatas.some((item) => item.id == bill.id))
				list.length = 0
				list.push(...newList)

				deletes.forEach((del) => {
					this.changes?.add({
						...changeBase,
						action: ChangeActionEnum.DELETE,
						detail: {
							id: del.id
						}
					})
				})
			} else {
				for (let index = 0; index < newDatas.length; index++) {
					const newData = newDatas[index]
					const oldData = list[index]
					const errorData = dataErrors[index]

					let isChanges = false
					const change: Change<ChangeBill> = {
						...changeBase,
						detail: {
							id: newData.id
						}
					}

					isChanges = this.changeUtil.setChange(
						errorData,
						newData,
						oldData,
						change,
						'description',
						isChanges
					)
					isChanges = this.changeUtil.setChange(
						errorData,
						newData,
						oldData,
						change,
						'amount',
						isChanges
					)
					isChanges = this.changeUtil.setChange(
						errorData,
						newData,
						oldData,
						change,
						'payment',
						isChanges
					)
					isChanges = this.changeUtil.setChange(
						errorData,
						newData,
						oldData,
						change,
						'shared',
						isChanges
					)
					isChanges = this.changeUtil.setChange(
						errorData,
						newData,
						oldData,
						change,
						'dueDate',
						isChanges
					)
					isChanges = this.changeUtil.setChange(
						errorData,
						newData,
						oldData,
						change,
						'complete',
						isChanges
					)
					isChanges = this.changeUtil.setChange(
						errorData,
						newData,
						oldData,
						change,
						'category',
						isChanges
					)
					isChanges = this.changeUtil.setChange(
						errorData,
						newData,
						oldData,
						change,
						'totalShared',
						isChanges
					)
					if (isChanges) {
						this.changes.add(change)
					}
				}
			}
		}
	}
}

export default BudgetBillService
