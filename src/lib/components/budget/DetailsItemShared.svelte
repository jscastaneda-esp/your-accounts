<script lang="ts">
	import { createEventDispatcher, onDestroy, onMount } from 'svelte'
	import { createForm } from 'felte'
	import { validator } from '@felte/validator-yup'
	import { page } from '$app/stores'
	import yup, { defaultNumber, defaultString } from '$utils/yup.utils'
	import Toast from '$utils/toast.utils'
	import { confirmPopup } from '$lib/stores/shared'
	import type { BudgetBillShared, Change } from '$lib/types'
	import { ChangeActionEnum, ChangeSectionEnum } from '$lib/enums'
	import ChangeUtil from '$lib/classes/ChangeUtil'
	import { trpc } from '$lib/trpc/client'
	import Table from '$components/shared/Table.svelte'
	import Popup from '$components/shared/popup/Popup.svelte'
	import Button from '$components/shared/buttons/Button.svelte'
	import Input from '$components/shared/Input.svelte'
	import Stat from '$components/shared/Stat.svelte'
	import { groupBy } from '$utils/array.utils'

	export let billId: number
	export let projectId: number
	export let total: number

	type ChangeBillShared = {
		description?: string
		amount?: number
	}

	const awaitLoad = [1, 2, 3, 4]
	const trpcF = trpc($page)
	const dispatch = createEventDispatcher<{ close: void }>()
	const changeUtil = new ChangeUtil<keyof ChangeBillShared>()
	let changes: Change<ChangeBillShared>[] = []

	let loading = false
	let screenLoading = false
	let countName = 0
	let list: BudgetBillShared[] = []
	let interval: ReturnType<typeof setInterval>

	// Form Definition
	const validationSchema = yup.object().shape({
		shared: yup.array().of(
			yup.object().shape({
				id: defaultNumber.min(1),
				description: defaultString.max(200),
				amount: defaultNumber.min(1).max(9999999999.99),
				budgetBillId: defaultNumber.min(1)
			})
		)
	})
	const { form, data, errors, touched, setFields, addField, unsetField } = createForm<{
		shared: BudgetBillShared[]
	}>({
		initialValues: {
			shared: []
		},
		extend: [validator({ schema: validationSchema })]
	})

	onMount(async () => {
		interval = setInterval(() => {
			handleSave()
		}, 10000)

		loading = true

		try {
			list = await trpcF.budgets.bills.getSharedById.query(billId)
			countName = list.length + 1
			setFields('shared', list, true)
		} catch (error) {
			Toast.error('Se presento un error al consultar los gastos compartidos', true)
			throw error
		} finally {
			loading = false
		}
	})

	onDestroy(() => {
		clearInterval(interval)
	})

	async function handleSave() {
		const changeList = [...changes]
		if (changeList.length > 0) {
			try {
				changes = changes.filter((change) => !changeList.some((del) => change.index == del.index))

				const sendChanges: Change<ChangeBillShared>[] = []
				const groupById = groupBy<Change<ChangeBillShared>>(changeList, (change) =>
					change.detail.id.toString()
				)
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

				await trpcF.projects.receiveChanges.mutate({
					projectId,
					changes: sendChanges
				})
			} catch (error) {
				changes = [...changeList, ...changes]
				Toast.error('Se presento un error al guardar', true)
				throw error
			}
		}
	}

	async function handleClose() {
		screenLoading = true

		try {
			await handleSave()
			dispatch('close')
		} finally {
			screenLoading = false
		}
	}

	async function handleAdd() {
		screenLoading = true

		try {
			const request = {
				description: `Gasto Compartido ${countName++}`,
				budgetBillId: billId
			}
			const newShared = await trpcF.budgets.bills.createShared.mutate(request)
			const newField = {
				id: newShared.id,
				amount: 0,
				...request
			}
			addField('shared', newField)
			list.push(newField)
		} catch (error) {
			Toast.error('Se presento un error al crear el gasto compartido', true)
			throw error
		} finally {
			screenLoading = false
		}
	}

	function handleDelete({ description }: BudgetBillShared, index: number) {
		confirmPopup.show(
			`¿Está seguro que desea eliminar el gasto compartido ${description}?`,
			undefined,
			() => unsetField(`shared.${index}`)
		)
	}

	function compareData() {
		const changeBase = {
			section: ChangeSectionEnum.BUDGET_BILL_SHARED,
			action: ChangeActionEnum.UPDATE
		}
		const newDatas = $data.shared
		const dataErrors = $errors.shared || []

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

				isChanges = changeUtil.setChange(
					errorData,
					newData,
					oldData,
					change,
					'description',
					isChanges
				)
				isChanges = changeUtil.setChange(errorData, newData, oldData, change, 'amount', isChanges)
				if (isChanges) {
					changes.push(change)
				}
			}
		}
	}

	$: if ($touched) compareData()
	$: total = $data.shared.reduce((previous, current) => previous + current.amount, 0)
</script>

<Popup open preventDefaultClose on:click={handleClose}>
	{#if screenLoading}
		<section class="z-[2000] fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
			<span class="loading loading-ring loading-xs text-primary" />
			<span class="loading loading-ring loading-sm text-primary" />
			<span class="loading loading-ring loading-md text-primary" />
			<span class="loading loading-ring loading-lg text-primary" />
		</section>
	{/if}

	<section class="-m-6">
		<Stat title="Total" value={total} className="text-xl w-fit">
			<i class="bx bxs-coin-stack" />
		</Stat>
		<form class="border-t border-t-base-200" use:form>
			<Table className="max-h-80">
				<tr slot="head">
					<th class="text-base">Descripción</th>
					<th class="text-base">Monto ($)</th>
					<th />
				</tr>
				<svelte:fragment slot="body">
					{#if loading}
						{#each awaitLoad as _}
							<tr class="animate-pulse">
								<td><div class="bg-slate-400 h-5" /></td>
								<td><div class="bg-slate-400 h-5" /></td>
								<td><div class="bg-slate-400 h-5" /></td>
							</tr>
						{/each}
					{:else}
						{#each $data.shared as item, index (`shared_${index}`)}
							<tr>
								<td>
									<Input
										id={`shared.${index}.description`}
										name={`shared.${index}.description`}
										errors={$errors.shared?.[index].description}
									/>
								</td>
								<td>
									<Input
										id={`shared.${index}.amount`}
										name={`shared.${index}.amount`}
										type="number"
										errors={$errors.shared?.[index].amount}
									/>
								</td>
								<td class="text-center !align-middle">
									<Button
										value=""
										className="btn-error btn-sm"
										on:click={() => handleDelete(item, index)}
									>
										<i class="bx bxs-trash-alt" />
									</Button>
								</td>
							</tr>
						{/each}
					{/if}
				</svelte:fragment>
				<tr slot="foot">
					<th colspan="3" class="p-0 align-middle">
						<Button
							value="Agregar pago compartido"
							className="btn-ghost btn-block min-h-full h-full p-1 rounded-none"
							on:click={handleAdd}
						>
							<i class="bx bxs-plus-square" />
						</Button>
					</th>
				</tr>
			</Table>
		</form>
	</section>
</Popup>
