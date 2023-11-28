<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import type { BudgetBill, FelteError } from '$lib/types'
	import ButtonGroup from '$components/shared/buttons/ButtonGroup.svelte'
	import Input from '$components/shared/Input.svelte'
	import Stat from '$components/shared/Stat.svelte'
	import Toggle from '$components/shared/Toggle.svelte'
	import Select from '$components/shared/Select.svelte'
	import { BudgetBillCategory } from '$lib/enums'
	import DetailsItemPay from './DetailsItemPay.svelte'
	import DetailsLogs from './DetailsLogs.svelte'
	import type { Dayjs } from 'dayjs'
	import { now } from '$utils/date.utils'

	export let data: BudgetBill
	export let index: number
	export let monthBudget: Dayjs
	export let daysMonth: number[]
	export let errors: {
		description: FelteError
		amount: FelteError
		complete: FelteError
	}

	const dispatch = createEventDispatcher<{ pay: number; delete: void }>()
	const prefixFieldName = `bills.${index}`

	let pending = 0
	let expired = false
	let showPay = false

	function handlePay({ detail }: { detail: number }) {
		dispatch('pay', detail)
	}

	$: {
		pending = data.complete ? 0 : data.amount - data.payment
		if (pending < 0) {
			pending = 0
		}
	}
	$: {
		const nowDate = now()
		expired =
			data.dueDate != 0 &&
			nowDate.month() === monthBudget.month() &&
			nowDate.date() > Number(data.dueDate)
	}
</script>

<section class="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-2">
	<Input
		id={`${prefixFieldName}.description`}
		name={`${prefixFieldName}.description`}
		label="Descripción"
		errors={errors.description}
		class="lg:col-span-2"
	/>
	<Input
		id={`${prefixFieldName}.amount`}
		name={`${prefixFieldName}.amount`}
		label="Monto"
		alt="($)"
		errors={errors.amount}
		type="number"
	/>
	<section class="lg:mt-8">
		<Stat title="Pago realizado" value={data.payment} className="text-xl">
			<i class="bx bxs-coin-stack" />
		</Stat>
	</section>
	<section class="lg:mt-8 text-left">
		<Stat title="Pago pendiente" value={pending} className="text-xl">
			<i class="bx bxs-timer" />
		</Stat>
	</section>

	<Select id={`${prefixFieldName}.category`} name={`${prefixFieldName}.category`} label="Categoría">
		<option value={BudgetBillCategory.HOUSE}>Hogar</option>
		<option value={BudgetBillCategory.ENTERTAINMENT}>Entretenimiento</option>
		<option value={BudgetBillCategory.PERSONAL}>Personal</option>
		<option value={BudgetBillCategory.VEHICLE_TRANSPORTATION}>Vehículo o Transporte</option>
		<option value={BudgetBillCategory.EDUCATION}>Educación</option>
		<option value={BudgetBillCategory.SERVICES}>Servicios</option>
		<option value={BudgetBillCategory.FINANCIAL}>Financiero</option>
		<option value={BudgetBillCategory.SAVING}>Ahorros</option>
		<option value={BudgetBillCategory.OTHERS}>Otros</option>
	</Select>

	<Select
		id={`${prefixFieldName}.dueDate`}
		name={`${prefixFieldName}.dueDate`}
		label="Vencimiento"
		alt={`de ${monthBudget.format('MMMM')}`}
		classNameLabel={expired ? 'text-warning' : ''}
		classNameSelect={expired ? 'select-warning text-warning' : ''}
	>
		<option value="0" selected>N/A</option>
		{#each daysMonth as day}
			<option value={day.toString()}>{day}</option>
		{/each}
	</Select>

	<section class="lg:pt-10 pl-2">
		<Toggle
			id={`${prefixFieldName}.complete`}
			name={`${prefixFieldName}.complete`}
			label="Completo"
		/>
	</section>

	<DetailsLogs billId={data.id} />

	<section class="sm:col-span-2 lg:col-span-5 flex flex-col items-center mt-1 w-full">
		<section class="w-full join grid grid-cols-2 lg:grid-cols-4">
			<ButtonGroup
				value="Pagar"
				className="btn-primary w-full lg:col-start-2"
				on:click={() => (showPay = !showPay)}
			>
				<i class="bx bxs-add-to-queue" />
			</ButtonGroup>
			<ButtonGroup
				value="Eliminar"
				className="btn-error w-full"
				on:click={() => dispatch('delete')}
			>
				<i class="bx bxs-trash-alt" />
			</ButtonGroup>
		</section>

		<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
		<article
			tabindex="0"
			class="collapse bg-gray-700 w-fit mt-1 shadow shadow-primary"
			class:collapse-open={showPay}
			class:!invisible={!showPay}
		>
			<main class="collapse-content">
				{#if showPay}
					<DetailsItemPay {pending} billId={data.id} on:pay={handlePay} />
				{/if}
			</main>
		</article>
	</section>
</section>
