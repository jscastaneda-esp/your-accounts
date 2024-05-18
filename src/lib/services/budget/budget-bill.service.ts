import { ChangesUtil } from '$utils/changes.utils'
import { BudgetBillCategory, ChangeActionEnum, ChangeSectionEnum } from '$lib/enums'
import { trpc } from '$lib/trpc/client'
import type { Router } from '$lib/server/trpc/routes'
import type { BudgetBill, Change, ChangeStore, FelteError } from '$lib/types'
import type { Readable } from 'svelte/store'
import type { TRPCClientInit, createTRPCClient } from 'trpc-sveltekit'

type ChangeBill = {
	description?: string
	amount?: number
	payment?: number
	dueDate?: string | number
	complete?: boolean
	category?: string
}

class BudgetBillService {
	private trpcF: ReturnType<typeof createTRPCClient<Router>>
	private changesUtil: ChangesUtil<keyof ChangeBill>

	constructor(
		init: TRPCClientInit,
		private changes?: Readable<Change[]> & ChangeStore
	) {
		this.trpcF = trpc(init)
		this.changesUtil = new ChangesUtil<keyof ChangeBill>()
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
			dueDate: '0',
			complete: false,
			category: BudgetBillCategory.OTHERS,
			...request
		}
	}

	async createTransaction(
		description: string,
		amount: number,
		operation: '+' | '-',
		billId: number
	) {
		let value: number = amount
		if (operation == '-') value *= -1

		await this.trpcF.budgets.bills.createTransaction.mutate({
			description: description,
			amount: value,
			billId
		})

		return value
	}

	compareData(
		newDatas: BudgetBill[],
		dataErrors: {
			id: FelteError
			description: FelteError
			amount: FelteError
			payment: FelteError
			dueDate: FelteError
			complete: FelteError
			category: FelteError
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
						id: del.id,
						action: ChangeActionEnum.DELETE,
						detail: {
							description: del.description
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
						id: newData.id,
						detail: {}
					}

					isChanges = this.changesUtil.setChange(
						errorData,
						newData,
						oldData,
						change,
						'description',
						isChanges
					)
					isChanges = this.changesUtil.setChange(
						errorData,
						newData,
						oldData,
						change,
						'amount',
						isChanges
					)
					isChanges = this.changesUtil.setChange(
						errorData,
						newData,
						oldData,
						change,
						'payment',
						isChanges
					)
					isChanges = this.changesUtil.setChange(
						errorData,
						newData,
						oldData,
						change,
						'dueDate',
						isChanges
					)
					isChanges = this.changesUtil.setChange(
						errorData,
						newData,
						oldData,
						change,
						'complete',
						isChanges
					)
					isChanges = this.changesUtil.setChange(
						errorData,
						newData,
						oldData,
						change,
						'category',
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
