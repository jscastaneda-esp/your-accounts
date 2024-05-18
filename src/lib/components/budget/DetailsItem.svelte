<script context="module" lang="ts">
	import { writable } from 'svelte/store'

	const current = writable(0)
</script>

<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import type { BudgetBill, FelteError } from '$lib/types'
	import TextInput from '$components/shared/TextInput.svelte'
	import Stat from '$components/shared/Stat.svelte'
	import Checkbox from '$components/shared/Checkbox.svelte'
	import Select from '$components/shared/Select.svelte'
	import { BudgetBillCategory } from '$lib/enums'
	import DetailsItemPay from './DetailsItemPay.svelte'
	import DetailsLogs from './DetailsLogs.svelte'
	import type { Dayjs } from 'dayjs'
	import { now } from '$utils/date.utils'
	import { money } from '$utils/number.utils'
	import Icon from '$components/shared/Icon.svelte'
	import Button from '$components/shared/buttons/Button.svelte'
	import Tooltip from '$components/shared/Tooltip.svelte'
	import { slide } from 'svelte/transition'

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
	let rest = 0
	let expired = false

	function handlePay({ detail }: { detail: number }) {
		dispatch('pay', detail)
	}

	$: {
		rest = data.amount - data.payment
		pending = data.complete ? 0 : rest
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
	$: month = `de ${monthBudget.format('MMM')}`
	$: paymentOpen = $current == data.id
</script>

<section class="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-[6px] gap-x-5">
	<section class="lg:col-span-2 flex gap-x-2">
		<Tooltip text="Completo" direction="right">
			<Checkbox id={`${prefixFieldName}.complete`} name={`${prefixFieldName}.complete`} />
		</Tooltip>

		<TextInput
			id={`${prefixFieldName}.description`}
			name={`${prefixFieldName}.description`}
			placeholder="Descripción"
			errors={errors.description}
		>
			<Icon slot="icon">
				<path
					d="M17,7H22V17H17V19A1,1 0 0,0 18,20H20V22H17.5C16.95,22 16,21.55 16,21C16,21.55 15.05,22 14.5,22H12V20H14A1,1 0 0,0 15,19V5A1,1 0 0,0 14,4H12V2H14.5C15.05,2 16,2.45 16,3C16,2.45 16.95,2 17.5,2H20V4H18A1,1 0 0,0 17,5V7M2,7H13V9H4V15H13V17H2V7M20,15V9H17V15H20Z"
				/>
			</Icon>
		</TextInput>
	</section>

	<TextInput
		id={`${prefixFieldName}.amount`}
		name={`${prefixFieldName}.amount`}
		placeholder="Monto"
		errors={errors.amount}
		type="number"
	>
		<Icon slot="icon">
			<path
				d="M7,15H9C9,16.08 10.37,17 12,17C13.63,17 15,16.08 15,15C15,13.9 13.96,13.5 11.76,12.97C9.64,12.44 7,11.78 7,9C7,7.21 8.47,5.69 10.5,5.18V3H13.5V5.18C15.53,5.69 17,7.21 17,9H15C15,7.92 13.63,7 12,7C10.37,7 9,7.92 9,9C9,10.1 10.04,10.5 12.24,11.03C14.36,11.56 17,12.22 17,15C17,16.79 15.53,18.31 13.5,18.82V21H10.5V18.82C8.47,18.31 7,16.79 7,15Z"
			/>
		</Icon>
	</TextInput>

	<Select
		id={`${prefixFieldName}.category`}
		name={`${prefixFieldName}.category`}
		label="Seleccione la categoría"
	>
		<option value={BudgetBillCategory.HOUSE}>🏠 Hogar</option>
		<option value={BudgetBillCategory.ENTERTAINMENT}>🎳 Entretenimiento</option>
		<option value={BudgetBillCategory.PERSONAL}>🙋🏽 Personal</option>
		<option value={BudgetBillCategory.VEHICLE_TRANSPORTATION}>🛻 Vehículo o Transporte</option>
		<option value={BudgetBillCategory.EDUCATION}>📚 Educación</option>
		<option value={BudgetBillCategory.SERVICES}>💡 Servicios</option>
		<option value={BudgetBillCategory.FINANCIAL}>🏦 Financiero</option>
		<option value={BudgetBillCategory.SAVING}>💰 Ahorros</option>
		<option value={BudgetBillCategory.OTHERS}>⁉️ Otros</option>
	</Select>

	<section class="flex gap-x-2">
		<Select
			id={`${prefixFieldName}.dueDate`}
			name={`${prefixFieldName}.dueDate`}
			label="Seleccione el vencimiento"
			className={expired ? 'text-warning' : ''}
		>
			<option value="0" selected>Sin vencimiento</option>
			{#each daysMonth as day}
				<option value={day.toString()}>🗓️ {day} {month}</option>
			{/each}
		</Select>

		<Tooltip text="Eliminar" direction="left">
			<Button className="btn-square btn-error" on:click={() => dispatch('delete')}>
				<Icon>
					<path
						d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"
					/>
				</Icon>
			</Button>
		</Tooltip>
	</section>

	<div class="stats stats-vertical shadow sm:stats-horizontal sm:col-span-2 lg:col-span-5">
		<Stat title="Pago realizado" value={data.payment} className="!p-2 text-xl place-items-center">
			<DetailsLogs slot="actions" billId={data.id} />
		</Stat>

		<Stat
			title="Pago pendiente"
			value={pending}
			className="!p-2 text-xl place-items-center"
			desc={data.complete || rest < 0 ? `${rest > 0 ? '↘︎' : '↗︎'} ${money(rest)}` : '-'}
			classDescName={`font-bold text-${rest < 0 && 'primary'}`}
		>
			<Button
				slot="actions"
				value="Pagar"
				className="btn-primary"
				on:click={() => {
					if ($current != data.id) {
						$current = data.id
					} else {
						$current = 0
					}
				}}
			>
				<Icon>
					<path
						d="M15 15V17H18V20H20V17H23V15H20V12H18V15M14.97 11.61C14.85 10.28 13.59 8.97 12 9C10.3 9.03 9 10.3 9 12C9 13.7 10.3 14.94 12 15C12.38 15 12.77 14.92 13.14 14.77C13.41 13.67 13.86 12.63 14.97 11.61M13 16H7C7 14.9 6.11 14 5 14V10C6.11 10 7 9.11 7 8H17C17 9.11 17.9 10 19 10V10.06C19.67 10.06 20.34 10.18 21 10.4V6H3V18H13.32C13.1 17.33 13 16.66 13 16Z"
					/>
				</Icon>
			</Button>
		</Stat>
	</div>

	{#if paymentOpen}
		<section
			transition:slide
			class="sm:col-span-2 lg:col-span-5 flex flex-col items-center w-full mt-1"
		>
			<DetailsItemPay {pending} billId={data.id} on:pay={handlePay} />
		</section>
	{/if}
</section>
