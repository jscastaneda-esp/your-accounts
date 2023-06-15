<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import type { BudgetBill, FelteError } from '$lib/types'
	import ButtonGroup from '$components/shared/buttons/ButtonGroup.svelte'
	import Input from '$components/shared/Input.svelte'
	import Stat from '$components/shared/Stat.svelte'
	import Toggle from '$components/shared/Toggle.svelte'
	import Select from '$components/shared/Select.svelte'
	import { BudgetBillCategory } from '$lib/enums'
	import dayjs from '$utils/dayjs.utils'

	export let data: BudgetBill
	export let index: number
	export let monthBudget: dayjs.Dayjs
	export let daysMonth: number[]
	export let errors: {
		description: FelteError
		amount: FelteError
		shared: FelteError
		complete: FelteError
	}

	const dispatch = createEventDispatcher()
	const prefixFieldName = `bills.${index}`

	let shared = 0
	let expired = false

	$: pending = data.complete ? 0 : data.amount - data.payment
	$: {
		if (isNaN(pending)) {
			shared = data.totalShared
		} else if (pending != 0) {
			shared = pending + data.totalShared
		} else {
			shared = 0
		}
	}
	$: {
		const now = dayjs()
		expired =
			data.dueDate != 0 && now.month() === monthBudget.month() && now.date() > Number(data.dueDate)
	}
</script>

<section class="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
	<Input
		id={`${prefixFieldName}.description`}
		name={`${prefixFieldName}.description`}
		label="Descripción"
		errors={errors.description}
	/>
	<Input
		id={`${prefixFieldName}.amount`}
		name={`${prefixFieldName}.amount`}
		label="Monto"
		alt="$"
		errors={errors.amount}
		type="number"
	/>
	<section class="lg:mt-8">
		<Stat title="Pago realizado" value={data.payment} className="text-xl">
			<i class="bx bxs-coin-stack" />
		</Stat>
	</section>
	<section
		class="lg:mt-8 tooltip-top text-left"
		class:tooltip={data.shared}
		data-tip={`Compartido: ${shared}`}
	>
		<Stat title="Pendiente" value={pending} className="text-xl">
			<i class="bx bxs-timer" />
		</Stat>
	</section>

	<Select id={`${prefixFieldName}.category`} name={`${prefixFieldName}.category`} label="Categoría">
		<option value="" disabled selected>Seleccione</option>
		<option value={BudgetBillCategory.HOUSE}>Hogar</option>
		<option value={BudgetBillCategory.ENTERTAINMENT}>Entretenimiento</option>
		<option value={BudgetBillCategory.PERSONAL}>Personal</option>
		<option value={BudgetBillCategory.VEHICLE_TRANSPORTATION}>Vehículo o Transporte</option>
		<option value={BudgetBillCategory.EDUCATION}>Educación</option>
		<option value={BudgetBillCategory.SERVICES}>Servicios</option>
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
		<option value="" selected>N/A</option>
		{#each daysMonth as day}
			<option value={day.toString()}>{day}</option>
		{/each}
	</Select>
	<section class="flex items-end pl-2">
		<Toggle
			id={`${prefixFieldName}.shared`}
			name={`${prefixFieldName}.shared`}
			label="Compartido"
		/>
	</section>
	<section class="flex items-end pl-2">
		<Toggle
			id={`${prefixFieldName}.complete`}
			name={`${prefixFieldName}.complete`}
			label="Completo"
		/>
	</section>

	<section class="join md:col-span-2 lg:col-span-4 justify-center mt-1">
		<ButtonGroup value="Pagar" className="btn-primary" on:click={() => dispatch('pay')}>
			<i class="bx bxs-add-to-queue" />
		</ButtonGroup>
		{#if data.shared}
			<ButtonGroup value="Compartir" className="btn-secondary" on:click={() => dispatch('share')}>
				<i class="bx bxs-share-alt" />
			</ButtonGroup>
		{/if}
		<ButtonGroup value="Eliminar" className="btn-error" on:click={() => dispatch('delete')}>
			<i class="bx bxs-trash-alt" />
		</ButtonGroup>
	</section>
</section>
