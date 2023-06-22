<script lang="ts">
	import { getContext } from 'svelte'
	import type { Readable, Writable } from 'svelte/store'
	import { createForm } from 'felte'
	import { validator } from '@felte/validator-yup'
	import { page } from '$app/stores'
	import ChangeUtil from '$lib/classes/ChangeUtil'
	import {
		BudgetBillCategory,
		ChangeActionEnum,
		ChangeSectionEnum,
		ContextNameEnum
	} from '$lib/enums'
	import { confirmPopup, screenLoading } from '$lib/stores/shared'
	import { trpc } from '$lib/trpc/client'
	import type { Budget, BudgetBill, Change, ChangeStore } from '$lib/types'
	import Toast from '$utils/toast.utils'
	import yup, { defaultBoolean, defaultNumber, defaultString } from '$utils/yup.utils'
	import dayjs from '$utils/dayjs.utils'

	import DetailsItem from '$components/budget/DetailsItem.svelte'
	import Table from '$components/shared/Table.svelte'
	import Button from '$components/shared/buttons/Button.svelte'

	export let data: Budget

	type ChangeBill = {
		description?: string
		amount?: number
		payment?: number
		shared?: boolean
		dueDate?: string | number
		complete?: boolean
		category?: string
	}

	const trpcF = trpc($page)
	const changeUtil = new ChangeUtil<keyof ChangeBill>()
	const { changes } = getContext<{
		changes: Readable<Change<ChangeBill>[]> & ChangeStore<ChangeBill>
	}>(ContextNameEnum.CHANGES)
	const { month } = getContext<{
		month: Writable<string>
	}>(ContextNameEnum.BUDGET_RESUME)
	const { bills } = getContext<{
		bills: {
			set: (this: void, value: BudgetBill[]) => void
		}
	}>(ContextNameEnum.BUDGET_BILLS)

	let daysMonth: number[] = []
	let list = data.bills
	let countName = list.length + 1

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
	const {
		form,
		data: dataForm,
		errors,
		touched,
		addField,
		unsetField,
		setFields
	} = createForm({
		initialValues: {
			bills: list
		},
		extend: [validator({ schema: validationSchema })]
	})

	async function handleAdd() {
		screenLoading.show()

		try {
			const request = {
				description: `Pago ${countName++}`,
				budgetId: data.id
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
			Toast.error('Se presento un error al crear el pago', true)
		} finally {
			screenLoading.hide()
		}
	}

	function handlePay(bill: BudgetBill, index: number, payment: number) {
		setFields(`bills.${index}.payment`, bill.payment + payment, true)
	}

	function handleDelete(bill: BudgetBill, index: number) {
		confirmPopup.show(
			`¿Está seguro que desea eliminar el pago ${bill.description}?`,
			undefined,
			() => unsetField(`bills.${index}`)
		)
	}

	function compareData() {
		const changeBase = {
			section: ChangeSectionEnum.BUDGET_BILL,
			action: ChangeActionEnum.UPDATE
		}
		const newDatas = $dataForm.bills
		const dataErrors = $errors.bills || []

		if (newDatas.length != list.length) {
			const deletes = list.filter((bill) => !newDatas.some((item) => item.id == bill.id))
			const newList = list.filter((bill) => newDatas.some((item) => item.id == bill.id))
			list.length = 0
			list.push(...newList)

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
				isChanges = changeUtil.setChange(errorData, newData, oldData, change, 'payment', isChanges)
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

	$: if ($touched) compareData()
	$: monthBudget = dayjs($month, 'YYYY-MM')
	$: {
		daysMonth = []
		const daysInMonth = monthBudget.daysInMonth()
		if (!isNaN(daysInMonth)) {
			for (let day = 1; day <= daysInMonth; day++) {
				daysMonth = [...daysMonth, day]
			}
		}
	}
	$: bills.set($dataForm.bills)
</script>

<form class="my-2 bg-base-100" use:form>
	<Table className="max-h-[calc(100vh-300px)]">
		<tr slot="head">
			<th class="text-center text-base">Pagos</th>
		</tr>
		<svelte:fragment slot="body">
			{#each $dataForm.bills as bill, index (`bill_${index}`)}
				<tr>
					<td>
						<DetailsItem
							data={bill}
							{index}
							{monthBudget}
							{daysMonth}
							projectId={data.projectId}
							errors={$errors.bills?.[index]}
							on:pay={({ detail }) => handlePay(bill, index, detail)}
							on:delete={() => handleDelete(bill, index)}
						/>
					</td>
				</tr>
			{/each}
		</svelte:fragment>
		<tr slot="foot">
			<th class="p-0 align-middle">
				<Button
					value="Agregar pago"
					className="btn-ghost btn-block min-h-full h-full p-1 rounded-none"
					on:click={handleAdd}
				>
					<i class="bx bxs-plus-square" />
				</Button>
			</th>
		</tr>
	</Table>
</form>

<style lang="postcss">
	td {
		@apply text-base;
	}
</style>
