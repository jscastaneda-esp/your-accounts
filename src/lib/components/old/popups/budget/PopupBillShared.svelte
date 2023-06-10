<!-- <script lang="ts">
	import { createEventDispatcher, getContext, onMount } from 'svelte'
	import { createForm } from 'felte'
	import { validator } from '@felte/validator-yup'
	import yup, { defaultString, defaultNumber } from '$utils/yup.utils'
	import Popup from '../../shared/Popup.svelte'
	import Input from '../../../shared/Input.svelte'
	import ButtonRounded from '../../shared/buttons/ButtonGroup.svelte'
	import type { BudgetBillShared, Change } from '../../../types'
	import Card from '../../cards/Card.svelte'
	import HeaderCardCompose from '../../cards/HeaderCardCompose.svelte'
	import SummaryValue from '../../Stat.svelte'
	import PopupConfirm from '../../shared/popup/ConfirmPopup.svelte'
	import Toast from '$utils/toast.utils'
	import { ChangeActionEnum, ChangeSectionEnum, ContextNameEnum } from '../../../enums'
	import type { changes as changesStore } from '../../../stores'
	import ScreenLoading from '../../ScreenLoading.svelte'
	import ChangeUtil from '../../../classes/ChangeUtil'
	import ConfirmPopupInfo from '../../../classes/ConfirmPopupInfo'
	import { trpc } from '../../../trpc/client'

	export let budgetBillId: number

	const trpcF = trpc()
	let loading: boolean
	let isLoadingData = false
	let countName = 0
	let list: BudgetBillShared[] = []
	let confirmPopupInfo = new ConfirmPopupInfo(
		false,
		'¿Está seguro que desea eliminar el gasto compartido :DESC?'
	)
	confirmPopupInfo.actionCancel = () => {
		confirmPopupInfo = confirmPopupInfo.reset(
			false,
			'¿Está seguro que desea eliminar el gasto compartido :DESC?'
		)
	}
	type ChangeBillShared = {
		description?: string
		amount?: number
	}
	const changeUtil = new ChangeUtil<keyof ChangeBillShared>()
	const { changes } = getContext<{ changes: typeof changesStore }>(ContextNameEnum.CHANGES)
	const dispatch = createEventDispatcher<{ changeTotal: number }>()

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
	const { form, data, errors, isValid, touched, setFields, addField, unsetField } = createForm<{
		shared: BudgetBillShared[]
	}>({
		initialValues: {
			shared: []
		},
		extend: [validator({ schema: validationSchema })]
	})

	onMount(async () => {
		isLoadingData = true

		try {
			list = await trpcF.budgets.bills.getSharedById.query(budgetBillId)
			countName = list.length + 1
			setFields('shared', list, true)
		} catch (error) {
			Toast.error('Se presento un error al consultar los gastos compartidos', true)
			throw error
		} finally {
			isLoadingData = false
		}
	})

	async function handleAdd() {
		if ($isValid) {
			loading = true

			try {
				const request = {
					description: `Gasto Compartido ${countName++}`,
					budgetBillId
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
				loading = false
			}
		}
	}

	function handleDelete({ description }: BudgetBillShared, index: number) {
		confirmPopupInfo.show = true
		confirmPopupInfo.question = confirmPopupInfo.question.replace(':DESC', description)
		confirmPopupInfo.actionOk = () => unsetField(`shared.${index}`)
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
					changes.add(change)
				}
			}
		}
	}

	$: total = $data.shared.reduce((previous, current) => previous + current.amount, 0)
	$: dispatch('changeTotal', total)
	$: if ($touched) compareData()
</script>

<Popup open showCloseButton on:click>
	<Card showBody classNameContainer="w-screen sm:w-[24rem]">
		<HeaderCardCompose slot="header" clickable={false}>
			<svelte:fragment slot="title">
				<SummaryValue icon="dollar-sign w-5" title="Total" value={total} className="text-base" />
			</svelte:fragment>
		</HeaderCardCompose>
		<form slot="body" class="flex flex-col overflow-y-auto max-h-[210px]" use:form>
			{#if isLoadingData}
				<article
					class="bg-gray-200 p-[6px] grid grid-cols-6 gap-2 items-center border-b-2 border-b-gray-300 animate-pulse"
				>
					<div class="bg-slate-400 h-11 w-full col-span-3" />
					<div class="bg-slate-400 h-11 w-full col-span-2" />
					<div class="flex justify-center col-span-1">
						<div class="z-10 block w-[30px] h-[30px] rounded-full bg-slate-400" />
					</div>
				</article>
			{:else}
				{#each $data.shared as item, index (`shared_${index}`)}
					<article
						class="bg-gray-200 p-[6px] grid grid-cols-6 gap-2 items-center border-b-2 border-b-gray-300"
					>
						<Input
							id={`shared.${index}.description`}
							name={`shared.${index}.description`}
							placeholder="Descripción"
							className="col-span-3"
							errors={$errors.shared?.[index].description}
						/>
						<Input
							id={`shared.${index}.amount`}
							name={`shared.${index}.amount`}
							placeholder="Monto ($)"
							type="number"
							className="col-span-2"
							errors={$errors.shared?.[index].amount}
						/>
						<div class="flex justify-center col-span-1">
							<ButtonRounded
								textColor="text-red-800"
								backgroundColor="bg-red-200"
								activeBackgroundColor="active:bg-red-200"
								on:click={() => handleDelete(item, index)}
							>
								<i class="fa-solid fa-trash" slot="left" />
							</ButtonRounded>
						</div>
					</article>
				{/each}
				{#if $isValid}
					<button
						type="button"
						class="bg-gray-200 py-[6px] px-3 flex items-center gap-1 text-xs text-gray-500 shadow-inner shadow-gray-300"
						on:click={handleAdd}
					>
						<i class="fa-solid fa-plus" />
						<span>Agregar gasto compartido</span>
					</button>
				{/if}
			{/if}
		</form>
	</Card>
</Popup>

{#if loading}
	<ScreenLoading />
{/if}

{#if confirmPopupInfo.show}
	<PopupConfirm data={confirmPopupInfo} />
{/if} -->
