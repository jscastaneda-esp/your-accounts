import { trpc } from '$lib/trpc/client'
import type { Router } from '$lib/trpc/router'
import type { TRPCClientInit, createTRPCClient } from 'trpc-sveltekit'
import type { Readable } from 'svelte/store'
import type { BudgetAvailable, Change, ChangeStore, FelteError } from '$lib/types'
import { ChangeSectionEnum, ChangeActionEnum } from '$lib/enums'
import ChangeUtil from '$lib/classes/ChangeUtil'

type ChangeAvailable = {
	name?: string
	amount?: number
}

class BudgetAvailableService {
	private trpcF: ReturnType<typeof createTRPCClient<Router>>
	private changeUtil: ChangeUtil<keyof ChangeAvailable>

	constructor(
		init: TRPCClientInit,
		private changes: Readable<Change<unknown>[]> & ChangeStore<unknown>
	) {
		this.trpcF = trpc(init)
		this.changeUtil = new ChangeUtil<keyof ChangeAvailable>()
	}

	async create(name: string, budgetId: number) {
		const request = {
			name,
			budgetId
		}
		const { id } = await this.trpcF.budgets.availables.create.mutate(request)
		return { id, amount: 0, ...request }
	}

	compareData(
		newDatas: BudgetAvailable[],
		dataErrors: {
			id: FelteError
			name: FelteError
			amount: FelteError
			budgetId: FelteError
		}[],
		list: BudgetAvailable[]
	) {
		const changeBase = {
			section: ChangeSectionEnum.BUDGET_AVAILABLE,
			action: ChangeActionEnum.UPDATE
		}
		dataErrors = dataErrors || []

		if (newDatas.length != list.length) {
			const deletes = list.filter((available) => !newDatas.some((item) => item.id == available.id))
			const newList = list.filter((available) => newDatas.some((item) => item.id == available.id))
			list.length = 0
			list.push(...newList)

			deletes.forEach((del) => {
				this.changes.add({
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
				const change: Change<ChangeAvailable> = {
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
					'name',
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
					this.changes.add(change)
				}
			}
		}
	}
}

export default BudgetAvailableService