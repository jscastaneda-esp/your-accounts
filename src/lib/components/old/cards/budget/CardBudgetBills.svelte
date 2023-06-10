<!-- <script lang="ts">
	import { getContext } from 'svelte'
	import Card from '../Card.svelte'
	import HeaderCardCompose from '../HeaderCardCompose.svelte'
	import SummaryValue from '../../Stat.svelte'
	import { createForm } from 'felte'
	import { validator } from '@felte/validator-yup'
	import yup, { defaultString, defaultNumber, defaultBoolean } from '$utils/yup.utils'
	import Toast from '$utils/toast.utils'
	import ItemCardBudgetBill from './ItemCardBudgetBill.svelte'
	import type { BudgetBill, Change } from '../../../types'
	import {
		BudgetBillCategory,
		ChangeActionEnum,
		ChangeSectionEnum,
		ContextNameEnum
	} from '../../../enums'
	import type { changes as changesStore } from '../../../stores'
	import PopupConfirm from '../../shared/popup/ConfirmPopup.svelte'
	import ChangeUtil from '../../../classes/ChangeUtil'
	import dayjs from '$utils/dayjs.utils'
	import ConfirmPopupInfo from '../../../classes/ConfirmPopupInfo'
	import { trpc } from '../../../trpc/client'

	export let isValidForm: boolean
	export let loading: boolean
	export let list: BudgetBill[]
	export let budgetId: number
	export let budgetMonth: string
	export let total: number
	export let totalPending: number
	export let totalMaxPayment: number
	export let totalSavings: number

	const now = dayjs()
	const trpcF = trpc()
	let show = false
	let daysMonth: number[] = []
	let countName = list.length + 1
	let totalPayment = 0
	let numberPending = 0
	let confirmPopupInfo = new ConfirmPopupInfo(
		false,
		'¿Está seguro que desea eliminar el gasto :DESC?'
	)
	confirmPopupInfo.actionCancel = () => {
		confirmPopupInfo = confirmPopupInfo.reset(
			false,
			'¿Está seguro que desea eliminar el gasto :DESC?'
		)
	}
	type ChangeBill = {
		description?: string
		amount?: number
		shared?: boolean
		dueDate?: string | number
		complete?: boolean
		category?: string | number
	}
	const changeUtil = new ChangeUtil<keyof ChangeBill>()
	const { changes } = getContext<{ changes: typeof changesStore }>(ContextNameEnum.CHANGES)

	// Form Definition
	const validationSchema = yup.object().shape({
		bills: yup.array().of(
			yup.object().shape({
				id: defaultNumber.min(1),
				description: defaultString.max(200),
				amount: defaultNumber.min(0).max(9999999999.99),
				payment: defaultNumber.min(0).max(9999999999.99),
				shared: defaultBoolean,
				dueDate: yup.string().max(2),
				complete: defaultBoolean,
				budgetId: defaultNumber.min(1),
				category: yup
					.mixed<BudgetBillCategory>()
					.oneOf(Object.values(BudgetBillCategory))
					.required()
			})
		)
	})
	const { form, data, errors, isValid, touched, addField, unsetField } = createForm({
		initialValues: {
			bills: list
		},
		extend: [validator({ schema: validationSchema })]
	})

	async function handleAdd() {
		if ($isValid) {
			loading = true

			try {
				const request = {
					description: `Gasto ${countName++}`,
					budgetId
				}
				const newBill = await trpcF.budgets.bills.create.mutate(request)
				const newField = {
					id: newBill.id,
					amount: 0,
					payment: 0,
					shared: false,
					dueDate: '',
					complete: false,
					category: null as unknown as BudgetBillCategory,
					totalShared: 0,
					...request
				}
				addField('bills', newField)
				list.push(newField)
			} catch (error) {
				Toast.error('Se presento un error al crear el gasto', true)
				throw error
			} finally {
				loading = false
			}
		}
	}

	function handleDelete({
		detail
	}: {
		detail: { index: number; id: number; description: string }
	}) {
		confirmPopupInfo.show = true
		confirmPopupInfo.question = confirmPopupInfo.question.replace(':DESC', detail.description)
		confirmPopupInfo.actionOk = () => unsetField(`bills.${detail.index}`)
	}

	function compareData() {
		const changeBase = {
			section: ChangeSectionEnum.BUDGET_BILL,
			action: ChangeActionEnum.UPDATE
		}
		const newDatas = $data.bills
		const dataErrors = $errors.bills || []

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
				const change: Change<ChangeBill> = {
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
				isChanges = changeUtil.setChange(errorData, newData, oldData, change, 'shared', isChanges)
				isChanges = changeUtil.setChange(errorData, newData, oldData, change, 'dueDate', isChanges)
				isChanges = changeUtil.setChange(errorData, newData, oldData, change, 'complete', isChanges)
				isChanges = changeUtil.setChange(errorData, newData, oldData, change, 'category', isChanges)
				if (isChanges) {
					changes.add(change)
				}
			}
		}
	}

	$: isValidForm = $isValid
	$: monthBudget = dayjs(budgetMonth, 'YYYY-MM')
	$: {
		daysMonth = []
		const daysInMonth = monthBudget.daysInMonth()
		if (!isNaN(daysInMonth)) {
			for (let day = 1; day <= daysInMonth; day++) {
				daysMonth = [...daysMonth, day]
			}
		}
	}
	$: {
		total = 0
		totalPending = 0
		totalSavings = 0
		totalPayment = 0
		numberPending = 0
		totalMaxPayment = 0

		$data.bills.forEach((bill) => {
			total += bill.amount
			totalPayment += bill.payment

			const pending = bill.amount - bill.payment
			if (!bill.complete) {
				totalPending += pending
			} else {
				totalSavings += pending
			}

			if (bill.amount > bill.payment && !bill.complete) {
				numberPending += 1
			}

			if (bill.amount < bill.payment) {
				let isTotalPayment = true
				if (bill.shared) {
					if (pending < 0) {
						totalMaxPayment += bill.payment + pending
						isTotalPayment = false
					}
				}

				if (isTotalPayment) {
					totalMaxPayment += bill.payment
				}
			} else {
				totalMaxPayment += bill.amount
			}
		})
	}
	$: if ($touched) compareData()
</script>

<div class="px-1">
	<Card showBody={show}>
		<HeaderCardCompose
			slot="header"
			iconAction={show ? 'caret-up' : 'caret-down'}
			on:click={() => {
				if (show && !$isValid) {
					Toast.warn('Completa la información', true)
					return
				} else if (!show && !budgetMonth) {
					Toast.warn('Mes del presupuesto obligatorio', true)
					return
				}

				show = !show
			}}
		>
			<svelte:fragment slot="title">
				<SummaryValue
					icon={`file-invoice-dollar ${show ? 'w-4' : 'w-5'}`}
					title="Pendiente"
					value={totalPending}
					className={show ? 'text-xs' : 'text-base'}
				/>
				<SummaryValue
					icon={`cash-register ${show ? 'w-4' : 'w-5'}`}
					title="Pago total"
					value={totalPayment}
					className={show ? 'text-xs' : 'text-base'}
				/>
			</svelte:fragment>
			<div
				slot="title-additional"
				class="flex gap-1 mt-1 items-center transition-all duration-75"
				class:text-[11px]={!show}
				class:text-[9px]={show}
			>
				<span
					class="bg-gray-200 text-center p-1 leading-none rounded font-semibold"
					class:min-w-[18px]={!show}
					class:min-w-[16px]={show}
				>
					{numberPending}
				</span>
				<span class="leading-none text-gray-500">Pagos pendientes</span>
			</div>
		</HeaderCardCompose>
		<div slot="body">
			<form class="flex flex-col overflow-y-auto max-h-[400px]" use:form>
				{#each $data.bills as bill, index (`bill_${index}`)}
					<ItemCardBudgetBill
						{now}
						{index}
						{monthBudget}
						{daysMonth}
						data={bill}
						errors={$errors.bills?.[index]}
						on:delete={handleDelete}
					/>
				{/each}
				{#if $isValid}
					<button
						type="button"
						class="bg-gray-200 py-[6px] px-3 flex items-center gap-1 text-xs text-gray-500 shadow-inner shadow-gray-300"
						on:click={handleAdd}
					>
						<i class="fa-solid fa-plus" />
						<span>Agregar gasto</span>
					</button>
				{/if}
			</form>
		</div>
	</Card>
</div>

<PopupConfirm data={confirmPopupInfo} /> -->
