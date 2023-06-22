import { trpc } from '$lib/trpc/client'
import type { Router } from '$lib/trpc/router'
import type { TRPCClientInit, createTRPCClient } from 'trpc-sveltekit'
import ProjectService from '../project.service'
import type { BudgetBillShared, Change, FelteError } from '$lib/types'
import { groupBy } from '$utils/array.utils'
import { ChangeActionEnum, ChangeSectionEnum } from '$lib/enums'
import ChangeUtil from '$lib/classes/ChangeUtil'

export type ChangeBillShared = {
	description?: string
	amount?: number
}

class BudgetBillService {
	private trpcF: ReturnType<typeof createTRPCClient<Router>>
	private projectService: ProjectService
	private changeUtil: ChangeUtil<keyof ChangeBillShared>

	constructor(init: TRPCClientInit) {
		this.trpcF = trpc(init)
		this.projectService = new ProjectService(init)
		this.changeUtil = new ChangeUtil<keyof ChangeBillShared>()
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

	async addShared(description: string, billId: number) {
		const request = {
			description,
			billId
		}
		const { id } = await this.trpcF.budgets.bills.createShared.mutate({
			description,
			billId
		})

		return {
			id,
			amount: 0,
			...request
		}
	}

	getSharedById(id: number) {
		return this.trpcF.budgets.bills.getSharedById.query(id)
	}

	saveShared(
		projectId: number,
		changes: Change<ChangeBillShared>[],
		errCb: (error: unknown) => void
	) {
		const changeList = [...changes]
		if (changeList.length > 0) {
			try {
				changes = changes.filter((change) => !changeList.some((del) => change.index == del.index))

				const sendChanges: Change<ChangeBillShared>[] = []
				const groupById = groupBy(changeList, (change) => change.detail.id.toString())
				Object.entries(groupById).forEach((group) => {
					const [id, items] = group

					const sendChange: Change<ChangeBillShared> = {
						section: ChangeSectionEnum.BUDGET_BILL_SHARED,
						action: ChangeActionEnum.UPDATE,
						detail: {
							id: Number(id)
						}
					}

					items.forEach((item) => (sendChange.detail = { ...sendChange.detail, ...item.detail }))
					sendChanges.push(sendChange)
				})

				return this.projectService.receiveChanges(projectId, sendChanges)
			} catch (error) {
				changes = [...changeList, ...changes]
				errCb(error)
			}
		}
	}

	compareDataShared(
		newDatas: BudgetBillShared[],
		dataErrors: {
			id: FelteError
			description: FelteError
			amount: FelteError
			billId: FelteError
		}[],
		list: BudgetBillShared[]
	) {
		const changeBase = {
			section: ChangeSectionEnum.BUDGET_BILL_SHARED,
			action: ChangeActionEnum.UPDATE
		}
		dataErrors = dataErrors || []
		const changes: Change<ChangeBillShared>[] = []

		if (newDatas.length != list.length) {
			const deletes = list.filter((bill) => !newDatas.some((item) => item.id == bill.id))
			list = list.filter((bill) => newDatas.some((item) => item.id == bill.id))

			deletes.forEach((del) => {
				changes.push({
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
				const change: Change<ChangeBillShared> = {
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
				if (isChanges) {
					changes.push(change)
				}
			}
		}

		return changes
	}
}

export default BudgetBillService
