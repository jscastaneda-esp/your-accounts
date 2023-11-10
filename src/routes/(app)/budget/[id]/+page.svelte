<script lang="ts">
	// Enums, Types, Utilities
	import { createForm } from 'felte'
	import { validator } from '@felte/validator-yup'
	import type { Budget, Change, ChangeStore, TotalsBills } from '$lib/types'
	import { zeroPad } from '$utils/number.utils'
	import yup, { defaultNumber, defaultString } from '$utils/yup.utils'
	import { ContextNameEnum } from '$lib/enums'

	// Components
	import Input from '$components/shared/Input.svelte'
	import Stat from '$components/shared/Stat.svelte'
	import ResourceLogs from '$components/shared/logs/ResourceLogs.svelte'
	import TotalResume from '$components/budget/TotalResume.svelte'
	import { getContext } from 'svelte'
	import type { Writable, Readable } from 'svelte/store'
	import BudgetService from '$services/budget/budget.service'
	import { page } from '$app/stores'

	const { changes } = getContext<{ changes: Readable<Change[]> & ChangeStore }>(
		ContextNameEnum.CHANGES
	)
	const { data } = getContext<{ data: Writable<Budget> }>(ContextNameEnum.BUDGET_MAIN)
	const { totalAvailable } = getContext<{ totalAvailable: Writable<number> }>(
		ContextNameEnum.BUDGET_AVAILABLES
	)
	const { month } = getContext<{ month: Writable<string> }>(ContextNameEnum.BUDGET_RESUME)
	const { totals: totalsBills } = getContext<{ totals: Readable<TotalsBills> }>(
		ContextNameEnum.BUDGET_BILLS
	)
	const service = new BudgetService($page, changes)

	// Form Definition
	const validationSchema = yup.object().shape({
		id: defaultNumber.min(1),
		name: defaultString.max(40),
		month: defaultString.matches(new RegExp('^\\d{4}-\\d{2}$')),
		fixedIncome: defaultNumber.min(0).max(9999999999.99),
		additionalIncome: defaultNumber.min(-9999999999.99).max(9999999999.99)
	})
	const {
		form,
		data: dataForm,
		errors,
		touched
	} = createForm({
		initialValues: {
			id: $data.id,
			name: $data.name,
			month: `${$data.year}-${zeroPad($data.month, 2)}`,
			fixedIncome: $data.fixedIncome,
			additionalIncome: $data.additionalIncome
		},
		extend: [validator({ schema: validationSchema })]
	})

	function compareData() {
		service.compareData($dataForm, $errors, $data)
	}

	$: totalIncome = $dataForm.fixedIncome + $dataForm.additionalIncome
	$: estimatedSavings = totalIncome - $totalsBills.total
	$: totalSaving = $totalAvailable - $totalsBills.totalPending
	$: percentageEstimatedSavings = (estimatedSavings * 100) / (totalIncome || 1)
	$: percentageTotalSavings = (totalSaving * 100) / (totalIncome || 1)
	$: totalDiff = totalSaving - estimatedSavings
	$: pendingRegistration =
		totalSaving - (totalIncome - $totalsBills.totalMaxPayment) - $totalsBills.totalSaving
	$: if ($touched) compareData()
	$: month.set($dataForm.month)
</script>

<section class="flex flex-col w-full bg-base-200">
	<form
		class="w-full grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-[6px] gap-x-5 px-4 pt-4"
		use:form
	>
		<Input id="name" name="name" label="Nombre" errors={$errors.name} />
		<Input
			id="month"
			name="month"
			label="Mes"
			alt="(aaaa-MM)"
			type="month"
			errors={$errors.month}
		/>
		<Input
			id="fixedIncome"
			name="fixedIncome"
			label="Ingreso fijo"
			alt="($)"
			type="number"
			errors={$errors.fixedIncome}
		/>
		<Input
			id="additionalIncome"
			name="additionalIncome"
			label="Ingreso adicional"
			alt="($)"
			type="number"
			errors={$errors.additionalIncome}
		/>
	</form>

	<div class="divider" />

	<section
		class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 justify-center items-center gap-5 px-4"
	>
		<TotalResume
			titleFrom="Pago Estimado"
			valueFrom={$totalsBills.total}
			titleTo="Pago Total"
			valueTo={$totalsBills.totalPayment}
		/>
		<TotalResume
			titleFrom="Ahorro Estimado"
			valueFrom={estimatedSavings}
			descFrom={(percentageEstimatedSavings > 0
				? '↗︎'
				: percentageEstimatedSavings == 0
				? '⇄'
				: '↘︎') + ` ${Math.abs(percentageEstimatedSavings).toFixed(1)}%`}
			titleTo="Ahorro Total"
			valueTo={totalSaving}
			descTo={(percentageTotalSavings > 0 ? '↗︎' : percentageTotalSavings == 0 ? '⇄' : '↘︎') +
				` ${Math.abs(percentageTotalSavings).toFixed(1)}%`}
		/>
		<TotalResume
			titleFrom="Disponible"
			valueFrom={$totalAvailable}
			titleTo="Pendiente"
			valueTo={$totalsBills.totalPending}
			descTo={`${$totalsBills.pendingBills} Pagos pendientes`}
		>
			<i class="bx bxs-wallet" slot="iconFrom" />
			<i class="bx bxs-timer" slot="iconTo" />
		</TotalResume>
		<section class="flex justify-center items-center">
			<article class="stats stats-vertical 2xl:stats-horizontal 2xl:grid-cols-2 shadow w-[500px]">
				<Stat title="Diferencia" value={totalDiff} className="text-lg">
					<i class="bx bxs-objects-vertical-center" />
				</Stat>
				<Stat title="Pendiente Registrar" value={pendingRegistration} className="text-xl font-bold">
					<i class="bx bxs-shield-minus" />
				</Stat>
			</article>
		</section>
	</section>

	<div class="divider" />

	<ResourceLogs resourceId={$data.id} />
</section>
