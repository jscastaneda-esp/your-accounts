import { trpc } from '$lib/trpc/client'
import type { Router } from '$lib/trpc/router'
import type { TRPCClientInit, createTRPCClient } from 'trpc-sveltekit'
import { zeroPad } from '$utils/number.utils'
import type { Readable } from 'svelte/store'
import type { Budget, Change, ChangeStore, FelteError } from '$lib/types'
import { groupBy } from '$utils/array.utils'
import { ChangeSectionEnum, ChangeActionEnum } from '$lib/enums'
import ChangeUtil from '$lib/classes/ChangeUtil'
import { trytm } from '@bdsqqq/try'
import { now } from '$utils/date.utils'

type ChangeMain = {
	name?: string
	year?: number
	month?: number
	fixedIncome?: number
	additionalIncome?: number
}

class BudgetService {
	private trpcF: ReturnType<typeof createTRPCClient<Router>>
	private changeUtil: ChangeUtil<keyof ChangeMain>

	constructor(
		init: TRPCClientInit,
		private changes?: Readable<Change<unknown>[]> & ChangeStore<unknown>
	) {
		this.trpcF = trpc(init)
		this.changeUtil = new ChangeUtil<keyof ChangeMain>()
	}

	create(cloneId?: number) {
		const nowDate = now()
		return this.trpcF.budgets.create.mutate({
			name: `Presupuesto ${zeroPad(nowDate.month(), 2)}/${nowDate.year()}`,
			cloneId
		})
	}

	getByUserId() {
		return this.trpcF.budgets.getByUserId.query()
	}

	delete(id: number) {
		return this.trpcF.budgets.delete.mutate(id)
	}

	async save(id: number, changeList: Change<unknown>[], errCb: (error: unknown) => void) {
		if (this.changes && changeList.length > 0) {
			this.changes.delete(changeList)

			const sendChanges: Change<unknown>[] = []
			const groupBySection = groupBy(changeList, (change) => change.section)
			Object.entries(groupBySection).forEach((group) => {
				const [section, items] = group
				const groupByAction = groupBy(items, (change) => change.action)
				Object.entries(groupByAction).forEach((group) => {
					const [action, items] = group
					const groupById = groupBy(items, (change) => change.detail.id.toString())
					Object.entries(groupById).forEach((group) => {
						const [id, items] = group

						const sendChange: Change<unknown> = {
							section: section as ChangeSectionEnum,
							action: action as ChangeActionEnum,
							detail: {
								id: Number(id)
							}
						}

						items.forEach((item) => (sendChange.detail = { ...sendChange.detail, ...item.detail }))
						sendChanges.push(sendChange)
					})
				})
			})

			const [_, error] = await trytm(
				this.trpcF.budgets.receiveChanges.mutate({
					id,
					changes: sendChanges
				})
			)
			if (error) {
				this.changes.revert(changeList)
				errCb(error)
			}
		}
	}

	compareData(
		newData: {
			id: number
			name: string
			month: string
			fixedIncome: number
			additionalIncome: number
		},
		errorData: {
			id: FelteError
			name: FelteError
			month: FelteError
			fixedIncome: FelteError
			additionalIncome: FelteError
		},
		data: Budget
	) {
		if (this.changes) {
			let isChanges = false
			const change: Change<ChangeMain> = {
				section: ChangeSectionEnum.BUDGET_MAIN,
				action: ChangeActionEnum.UPDATE,
				detail: {
					id: data.id
				}
			}

			if (!errorData?.month) {
				const monthParts = newData.month.split('-')
				const year = Number(monthParts[0])
				const month = Number(monthParts[1])
				isChanges = this.changeUtil.setChangeDirect(year, data, change, 'year', isChanges)
				isChanges = this.changeUtil.setChangeDirect(month, data, change, 'month', isChanges)
			}

			isChanges = this.changeUtil.setChange(errorData, newData, data, change, 'name', isChanges)
			isChanges = this.changeUtil.setChange(
				errorData,
				newData,
				data,
				change,
				'fixedIncome',
				isChanges
			)
			isChanges = this.changeUtil.setChange(
				errorData,
				newData,
				data,
				change,
				'additionalIncome',
				isChanges
			)
			if (isChanges) {
				this.changes.add(change)
			}
		}
	}
}

export default BudgetService
