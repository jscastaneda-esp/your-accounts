<script lang="ts">
	// Enums, Types, Utilities
	import { createForm } from 'felte'
	import { validator } from '@felte/validator-yup'
	import type { Budget, Change, ChangeStore, TotalsBills } from '$lib/types'
	import { zeroPad } from '$utils/number.utils'
	import yup, { defaultNumber, defaultString } from '$utils/yup.utils'
	import { ContextNameEnum } from '$lib/enums'

	// Components
	import TextInput from '$components/shared/TextInput.svelte'
	import Stat from '$components/shared/Stat.svelte'
	import ResourceLogs from '$components/shared/logs/ResourceLogs.svelte'
	import TotalResume from '$components/budget/TotalResume.svelte'
	import { getContext } from 'svelte'
	import type { Writable, Readable } from 'svelte/store'
	import BudgetService from '$services/budget/budget.service'
	import { page } from '$app/stores'
	import Icon from '$components/shared/Icon.svelte'

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

<section class="flex flex-col w-full bg-base-300">
	<form
		class="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[6px] gap-x-5 px-4 pt-4"
		use:form
	>
		<TextInput id="name" name="name" placeholder="Nombre" errors={$errors.name}>
			<Icon slot="icon">
				<path
					d="M17,7H22V17H17V19A1,1 0 0,0 18,20H20V22H17.5C16.95,22 16,21.55 16,21C16,21.55 15.05,22 14.5,22H12V20H14A1,1 0 0,0 15,19V5A1,1 0 0,0 14,4H12V2H14.5C15.05,2 16,2.45 16,3C16,2.45 16.95,2 17.5,2H20V4H18A1,1 0 0,0 17,5V7M2,7H13V9H4V15H13V17H2V7M20,15V9H17V15H20Z"
				/>
			</Icon>
		</TextInput>
		<TextInput id="month" name="month" placeholder="Mes" type="month" errors={$errors.month}>
			<Icon slot="icon">
				<path
					d="M9,10V12H7V10H9M13,10V12H11V10H13M17,10V12H15V10H17M19,3A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5A2,2 0 0,1 5,3H6V1H8V3H16V1H18V3H19M19,19V8H5V19H19M9,14V16H7V14H9M13,14V16H11V14H13M17,14V16H15V14H17Z"
				/>
			</Icon>
		</TextInput>
		<TextInput
			id="fixedIncome"
			name="fixedIncome"
			placeholder="Ingreso fijo"
			type="number"
			errors={$errors.fixedIncome}
		>
			<Icon slot="icon">
				<path
					d="M7,15H9C9,16.08 10.37,17 12,17C13.63,17 15,16.08 15,15C15,13.9 13.96,13.5 11.76,12.97C9.64,12.44 7,11.78 7,9C7,7.21 8.47,5.69 10.5,5.18V3H13.5V5.18C15.53,5.69 17,7.21 17,9H15C15,7.92 13.63,7 12,7C10.37,7 9,7.92 9,9C9,10.1 10.04,10.5 12.24,11.03C14.36,11.56 17,12.22 17,15C17,16.79 15.53,18.31 13.5,18.82V21H10.5V18.82C8.47,18.31 7,16.79 7,15Z"
				/>
			</Icon>
		</TextInput>
		<TextInput
			id="additionalIncome"
			name="additionalIncome"
			placeholder="Ingreso adicional"
			type="number"
			errors={$errors.additionalIncome}
		>
			<Icon slot="icon">
				<path
					d="M7,15H9C9,16.08 10.37,17 12,17C13.63,17 15,16.08 15,15C15,13.9 13.96,13.5 11.76,12.97C9.64,12.44 7,11.78 7,9C7,7.21 8.47,5.69 10.5,5.18V3H13.5V5.18C15.53,5.69 17,7.21 17,9H15C15,7.92 13.63,7 12,7C10.37,7 9,7.92 9,9C9,10.1 10.04,10.5 12.24,11.03C14.36,11.56 17,12.22 17,15C17,16.79 15.53,18.31 13.5,18.82V21H10.5V18.82C8.47,18.31 7,16.79 7,15Z"
				/>
			</Icon>
		</TextInput>
	</form>

	<div class="divider divider-primary" />

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
			classNameDescFrom={`font-bold text-${percentageEstimatedSavings < 0 && 'primary'}`}
			titleTo="Ahorro Total"
			valueTo={totalSaving}
			descTo={(percentageTotalSavings > 0 ? '↗︎' : percentageTotalSavings == 0 ? '⇄' : '↘︎') +
				` ${Math.abs(percentageTotalSavings).toFixed(1)}%`}
			classNameDescTo={`font-bold text-${percentageTotalSavings < 0 && 'primary'}`}
		/>
		<TotalResume
			titleFrom="Disponible"
			valueFrom={$totalAvailable}
			titleTo="Pendiente"
			valueTo={$totalsBills.totalPending}
			descTo={`Pago(s) pendientes: ${$totalsBills.pendingBills}`}
		>
			<Icon slot="iconFrom" className="!h-6 !w-6">
				<path
					d="M21,18V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5A2,2 0 0,1 5,3H19A2,2 0 0,1 21,5V6H12C10.89,6 10,6.9 10,8V16A2,2 0 0,0 12,18M12,16H22V8H12M16,13.5A1.5,1.5 0 0,1 14.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,12A1.5,1.5 0 0,1 16,13.5Z"
				/>
			</Icon>
			<Icon slot="iconTo" className="!h-6 !w-6">
				<path
					d="M17.5 16.82L19.94 18.23L19.19 19.53L16 17.69V14H17.5V16.82M24 17C24 20.87 20.87 24 17 24S10 20.87 10 17C10 16.66 10.03 16.33 10.08 16H2V4H20V10.68C22.36 11.81 24 14.21 24 17M10.68 14C10.86 13.64 11.05 13.3 11.28 12.97C11.19 13 11.1 13 11 13C9.34 13 8 11.66 8 10S9.34 7 11 7 14 8.34 14 10C14 10.25 13.96 10.5 13.9 10.73C14.84 10.27 15.89 10 17 10C17.34 10 17.67 10.03 18 10.08V8C16.9 8 16 7.11 16 6H6C6 7.11 5.11 8 4 8V12C5.11 12 6 12.9 6 14H10.68M22 17C22 14.24 19.76 12 17 12S12 14.24 12 17 14.24 22 17 22 22 19.76 22 17Z"
				/>
			</Icon>
		</TotalResume>
		<section class="flex justify-center items-center">
			<article class="stats stats-vertical shadow w-[500px]">
				<Stat title="Diferencia" value={totalDiff} className="text-lg">
					<Icon className="!h-6 !w-6">
						<path
							d="M13 20V8.8C13.5 8.6 14 8.3 14.3 7.9L17.8 9.2L14.9 16C14.4 18 15.9 19 18.4 19S22.5 18 21.9 16L19.3 9.7L20.2 10L20.9 8.1L15 6C15 4.8 14.3 3.6 13 3.1C11.8 2.6 10.5 3.1 9.7 4L3.9 2L3.2 3.8L4.8 4.4L2.1 11C1.6 13 3.1 14 5.6 14S9.7 13 9.1 11L6.6 5.1L9 6C9 7.2 9.7 8.4 11 8.9V20H2V22H22V20H13M19.9 16H16.9L18.4 12.2L19.9 16M7.1 11H4.1L5.6 7.2L7.1 11M11.1 5.7C11.3 5.2 11.9 4.9 12.4 5.1S13.2 5.9 13 6.4 12.2 7.2 11.7 7 10.9 6.2 11.1 5.7Z"
						/>
					</Icon>
				</Stat>
				<Stat title="Pendiente Registrar" value={pendingRegistration} className="text-xl font-bold">
					<Icon className="!h-6 !w-6">
						<path
							d="M13 9H3V5H13M10 19C8.3 19 7 17.7 7 16S8.3 13 10 13 13 14.3 13 16 11.7 19 10 19M15 3H3C1.9 3 1 3.9 1 5V19C1 20.1 1.9 21 3 21H17C18.1 21 19 20.1 19 19V7L15 3M23 13H21V7H23V13M23 17H21V15H23V17Z"
						/>
					</Icon>
				</Stat>
			</article>
		</section>
	</section>

	<ResourceLogs resourceId={$data.id} />
</section>
