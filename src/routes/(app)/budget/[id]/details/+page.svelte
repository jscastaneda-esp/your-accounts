<script lang="ts">
	import { getContext, tick } from 'svelte'
	import type { Readable, Writable } from 'svelte/store'
	import { createForm } from 'felte'
	import { validator } from '@felte/validator-yup'
	import { page } from '$app/stores'
	import { BudgetBillCategory, ContextNameEnum } from '$lib/enums'
	import { confirmPopup, screenLoading } from '$lib/stores/shared'
	import type { Budget, BudgetBill, Change, ChangeStore } from '$lib/types'
	import Toast from '$utils/toast.utils'
	import yup, { defaultBoolean, defaultNumber, defaultString } from '$utils/yup.utils'

	import Table from '$components/shared/Table.svelte'
	import Button from '$components/shared/buttons/Button.svelte'
	import BudgetBillService from '$services/budget/budget-bill.service'
	import { trytm } from '@bdsqqq/try'
	import { toDate } from '$utils/date.utils'
	import TextInput from '$components/shared/TextInput.svelte'
	import Icon from '$components/shared/Icon.svelte'

	export let data: Budget

	const { changes } = getContext<{ changes: Readable<Change[]> & ChangeStore }>(
		ContextNameEnum.CHANGES
	)
	const { month } = getContext<{ month: Writable<string> }>(ContextNameEnum.BUDGET_RESUME)
	const { bills } = getContext<{ bills: { set: (this: void, value: BudgetBill[]) => void } }>(
		ContextNameEnum.BUDGET_BILLS
	)
	const service = new BudgetBillService($page, changes)

	let refTable: Table
	let daysMonth: number[] = []
	let list = data.bills
	let countName = list.length + 1
	let search = ''

	// Form Definition
	const validationSchema = yup.object().shape({
		bills: yup.array().of(
			yup.object().shape({
				id: defaultNumber.min(1),
				description: defaultString.max(200),
				amount: defaultNumber.min(0).max(9999999999.99),
				payment: defaultNumber.min(0).max(9999999999.99),
				dueDate: yup.string().max(2),
				complete: defaultBoolean,
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

		const [newField, error] = await trytm(service.create(`Pago ${countName++}`, data.id))
		if (error) {
			Toast.error('Se presento un error al crear el pago')
		} else {
			addField('bills', newField)
			list.push(newField)
		}

		if (refTable) {
			await tick()
			refTable.scrollBottom()
		}

		screenLoading.hide()
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
		service.compareData($dataForm.bills, $errors.bills, list)
	}

	$: if ($touched) compareData()
	$: monthBudget = toDate($month, 'YYYY-MM')
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

<form class="bg-base-300" use:form>
	<Table bind:this={refTable} className="max-h-[calc(100vh-210px)]">
		<tr slot="head" class="bg-base-300 border-b-primary">
			<td>
				<TextInput
					id="search_bill"
					name="search_bill"
					type="search"
					placeholder="Buscar pagos"
					bordered
					bind:value={search}
				>
					<Icon slot="icon">
						<path
							d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"
						/>
					</Icon>
				</TextInput>
			</td>
		</tr>
		<svelte:fragment slot="body">
			{#each $dataForm.bills as bill, index (`bill_${index}`)}
				<tr
					class:hidden={search
						? !bill.description.toLowerCase().match(`${search.toLowerCase()}.*`)
						: false}
					class="border-b-primary"
				>
					<td>
						{#await import('$components/budget/DetailsItem.svelte')}
							<div class="skeleton w-full h-52 bg-gray-700" />
						{:then { default: DetailsItem }}
							<DetailsItem
								data={bill}
								{index}
								{monthBudget}
								{daysMonth}
								errors={$errors.bills?.[index]}
								on:pay={({ detail }) => handlePay(bill, index, detail)}
								on:delete={() => handleDelete(bill, index)}
							/>
						{/await}
					</td>
				</tr>
			{:else}
				<tr>
					<td class="align-middle text-center"> Registra tu primer pago </td>
				</tr>
			{/each}
		</svelte:fragment>
		<tr slot="foot">
			<th class="p-0 align-middle">
				<Button
					value="Agregar pago"
					className="btn-primary btn-block btn-xs text-sm rounded-none"
					block
					on:click={handleAdd}
				>
					<Icon>
						<path
							d="M3 16H10V14H3M18 14V10H16V14H12V16H16V20H18V16H22V14M14 6H3V8H14M14 10H3V12H14V10Z"
						/>
					</Icon>
				</Button>
			</th>
		</tr>
	</Table>
</form>
