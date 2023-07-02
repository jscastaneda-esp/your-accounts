import { trpc } from '$lib/trpc/client'
import type { Router } from '$lib/trpc/router'
import type { TRPCClientInit, createTRPCClient } from 'trpc-sveltekit'
import ProjectService from '../project.service'
import type { BudgetBillShared, Change, ChangeStore, FelteError } from '$lib/types'
import { groupBy } from '$utils/array.utils'
import { ChangeActionEnum, ChangeSectionEnum } from '$lib/enums'
import ChangeUtil from '$lib/classes/ChangeUtil'
import type { Readable } from 'svelte/store'
import { trytm } from '@bdsqqq/try'

type ChangeBillShared = {
	description?: string
	amount?: number
}

class BudgetBillSharedService {
	private trpcF: ReturnType<typeof createTRPCClient<Router>>
	private projectService: ProjectService
	private changeUtil: ChangeUtil<keyof ChangeBillShared>

	constructor(init: TRPCClientInit) {
		this.trpcF = trpc(init)
		this.projectService = new ProjectService(init)
		this.changeUtil = new ChangeUtil<keyof ChangeBillShared>()
	}

	async create(description: string, billId: number) {
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

	getByBudgetId(id: number) {
		return this.trpcF.budgets.bills.getSharedById.query(id)
	}

	async save(
		projectId: number,
		changeList: Change<unknown>[],
		changes: Readable<Change<unknown>[]> & ChangeStore<unknown>,
		errCb: (error: unknown) => void
	) {
		if (changeList.length > 0) {
			changes.delete(changeList)

			const sendChanges: Change<ChangeBillShared>[] = []
			const groupByAction = groupBy(changeList, (change) => change.action)
			Object.entries(groupByAction).forEach((group) => {
				const [action, items] = group
				const groupById = groupBy(items, (change) => change.detail.id.toString())
				Object.entries(groupById).forEach((group) => {
					const [id, items] = group

					const sendChange: Change<ChangeBillShared> = {
						section: ChangeSectionEnum.BUDGET_BILL_SHARED,
						action: action as ChangeActionEnum,
						detail: {
							id: Number(id)
						}
					}

					items.forEach((item) => (sendChange.detail = { ...sendChange.detail, ...item.detail }))
					sendChanges.push(sendChange)
				})
			})

			const [_, error] = await trytm(this.projectService.receiveChanges(projectId, sendChanges))
			if (error) {
				changes.revert(changeList)
				errCb(error)
			}
		}
	}

	compareData(
		newDatas: BudgetBillShared[],
		dataErrors: {
			id: FelteError
			description: FelteError
			amount: FelteError
			billId: FelteError
		}[],
		list: BudgetBillShared[],
		changes: Readable<Change<unknown>[]> & ChangeStore<unknown>
	) {
		const changeBase = {
			section: ChangeSectionEnum.BUDGET_BILL_SHARED
		}
		dataErrors = dataErrors || []

		if (newDatas.length != list.length) {
			const deletes = list.filter((bill) => !newDatas.some((item) => item.id == bill.id))
			list = list.filter((bill) => newDatas.some((item) => item.id == bill.id))

			deletes.forEach((del) => {
				changes.add({
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
					action: ChangeActionEnum.UPDATE,
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
					changes.add(change)
				}
			}
		}
	}
}

export default BudgetBillSharedService
