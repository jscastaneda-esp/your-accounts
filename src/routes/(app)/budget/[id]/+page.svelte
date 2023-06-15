<script lang="ts">
	// Enums, Types, Utilities
	import { createForm } from 'felte'
	import { validator } from '@felte/validator-yup'
	import type { Budget, BudgetBill, Change, ChangeStore, TotalsBills } from '$lib/types'
	import { zeroPad } from '$utils/number.utils'
	import yup, { defaultNumber, defaultString } from '$utils/yup.utils'
	import ChangeUtil from '$lib/classes/ChangeUtil'
	import { ChangeActionEnum, ChangeSectionEnum, ContextNameEnum } from '$lib/enums'

	// Components
	import Input from '$components/shared/Input.svelte'
	import Stat from '$components/shared/Stat.svelte'
	import Logs from '$components/shared/Logs.svelte'
	import ResumeProgress from '$components/budget/ResumeProgress.svelte'
	import { getContext } from 'svelte'
	import type { Writable, Readable } from 'svelte/store'
	// import CardBudgetBills from '$components/cards/budget/CardBudgetBills.svelte'

	export let data: Budget

	type ChangeMain = {
		name?: string
		year?: number
		month?: number
		fixedIncome?: number
		additionalIncome?: number
	}

	const changeUtil = new ChangeUtil<keyof ChangeMain>()
	const { changes } = getContext<{
		changes: Readable<Change<ChangeMain>[]> & ChangeStore<ChangeMain>
	}>(ContextNameEnum.CHANGES)
	const { totalAvailable } = getContext<{ totalAvailable: Writable<number> }>(
		ContextNameEnum.BUDGET_AVAILABLES
	)
	const { month } = getContext<{
		month: Writable<string>
	}>(ContextNameEnum.BUDGET_RESUME)
	const { totals: totalsBills } = getContext<{
		totals: Readable<TotalsBills>
	}>(ContextNameEnum.BUDGET_BILLS)

	// Form Definition
	const validationSchema = yup.object().shape({
		id: defaultNumber.min(1),
		name: defaultString.max(40),
		month: defaultString.matches(new RegExp('^\\d{4}-\\d{2}$')),
		fixedIncome: defaultNumber.min(0).max(9999999999.99),
		additionalIncome: defaultNumber.min(0).max(9999999999.99)
	})
	const {
		form,
		data: dataForm,
		errors,
		touched
	} = createForm({
		initialValues: {
			id: data.id,
			name: data.name,
			month: `${data.year}-${zeroPad(data.month, 2)}`,
			fixedIncome: data.fixedIncome,
			additionalIncome: data.additionalIncome
		},
		extend: [validator({ schema: validationSchema })]
	})

	function compareData() {
		const newData = $dataForm
		const errorData = $errors

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
			isChanges = changeUtil.setChangeDirect(year, data, change, 'year', isChanges)
			isChanges = changeUtil.setChangeDirect(month, data, change, 'month', isChanges)
		}

		isChanges = changeUtil.setChange(errorData, newData, data, change, 'name', isChanges)
		isChanges = changeUtil.setChange(errorData, newData, data, change, 'fixedIncome', isChanges)
		isChanges = changeUtil.setChange(
			errorData,
			newData,
			data,
			change,
			'additionalIncome',
			isChanges
		)
		if (isChanges) {
			changes.add(change)
		}
	}

	$: estimatedBalance = data.fixedIncome + data.additionalIncome - $totalsBills.total
	$: totalBalance = $totalAvailable - $totalsBills.totalPending
	$: if ($touched) compareData()
	$: month.set($dataForm.month)
</script>

<svelte:head>
	<title>Presupuesto | Tus Cuentas</title>
</svelte:head>

<section class="flex flex-col w-full">
	<form
		class="w-full grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-[6px] gap-x-5 px-4 pt-4"
		use:form
	>
		<Input id="name" name="name" label="Nombre" errors={$errors.name} />
		<Input id="month" name="month" label="Mes" alt="aaaa-MM" type="month" errors={$errors.month} />
		<Input
			id="fixedIncome"
			name="fixedIncome"
			label="Ingreso fijo"
			alt="$"
			type="number"
			errors={$errors.fixedIncome}
		/>
		<Input
			id="additionalIncome"
			name="additionalIncome"
			label="Ingreso adicional"
			alt="$"
			type="number"
			errors={$errors.additionalIncome}
		/>
	</form>

	<div class="divider" />

	<section class="grid grid-cols-1 sm:grid-cols-2 justify-center items-center gap-5 px-4">
		<ResumeProgress name="Pago" estimated={$totalsBills.total} total={$totalsBills.totalPayment} />
		<ResumeProgress name="Saldo" estimated={estimatedBalance} total={totalBalance} />
		<section class="flex justify-center items-center">
			<article class="stats stats-vertical sm:stats-horizontal sm:grid-cols-2 shadow w-[500px]">
				<Stat title="Disponible" value={$totalAvailable} className="text-lg">
					<i class="bx bxs-wallet-alt" />
				</Stat>
				<Stat
					title="Pendiente"
					value={$totalsBills.totalPending}
					desc={`${$totalsBills.pendingBills} Pagos pendientes`}
					className="text-lg"
				>
					<i class="bx bxs-timer" />
				</Stat>
			</article>
		</section>
		<section class="flex justify-center items-center">
			<article class="stats stats-vertical sm:stats-horizontal sm:grid-cols-2 shadow w-[500px]">
				<Stat title="Descuadre" value={totalBalance - estimatedBalance} className="text-lg">
					<i class="bx bxs-objects-vertical-center" />
				</Stat>
				<Stat
					title="Pendiente Registrar"
					value={totalBalance -
						(data.fixedIncome + data.additionalIncome - $totalsBills.totalMaxPayment) -
						$totalsBills.totalSavings}
					className="text-xl font-bold"
				>
					<i class="bx bxs-shield-minus" />
				</Stat>
			</article>
		</section>
	</section>

	<div class="divider" />

	<Logs projectId={data.projectId} />
</section>

<!-- <article class="px-2 py-3 flex flex-col gap-[10px] mb-[5.2rem] md:mb-[7.6rem]">
	<section class="grid grid-cols-[repeat(auto-fit,_minmax(294px,_1fr))] gap-[10px]">
		<CardBudgetBills
			bind:isValidForm={isValidBills}
			bind:loading
			bind:total={data.total}
			bind:totalPending={totalBillPending}
			bind:totalMaxPayment={totalBillMaxPayment}
			bind:totalSavings={totalBillSavings}
			budgetId={data.id}
			budgetMonth={$dataForm.month}
			list={data.bills}
		/>
	</section>
</article> -->
