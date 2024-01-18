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

<form class="bg-base-200" use:form>
	<Table bind:this={refTable} className="max-h-[calc(100vh-210px)]">
		<tr slot="head" class="bg-base-200">
			<td>
				<div class="join w-full lg:w-1/2">
					<span class="kbd join-item w-10">
						<i class="bx bx-search-alt-2" />
					</span>
					<input
						id="search_bill"
						name="search_bill"
						type="search"
						placeholder="Buscar pagos"
						bind:value={search}
						class="input input-bordered w-full join-item"
					/>
				</div>
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
							<div class="skeleton w-full h-32 bg-gray-700" />
						{:then DetailsItem}
							<DetailsItem.default
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
			<th class="p-0 align-middle bg-base-200">
				<Button
					value="Agregar pago"
					className="btn-primary btn-block btn-xs text-sm rounded-none"
					on:click={handleAdd}
				>
					<i class="bx bxs-plus-square text-lg" />
				</Button>
			</th>
		</tr>
	</Table>
</form>
