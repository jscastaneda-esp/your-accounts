<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import ButtonRounded from '../../shared/buttons/ButtonGroup.svelte'
	import Input from '../../../shared/Input.svelte'
	import type { BudgetBill, FelteError } from '../../../types'
	import SummaryValue from '../../Stat.svelte'
	import InputSwitch from '../../inputs/InputSwitch.svelte'
	import PopupBillRegister from '../../popups/budget/PopupBillRegister.svelte'
	import PopupBillShared from '../../popups/budget/PopupBillShared.svelte'
	import type dayjs from '$utils/dayjs.utils'
	import { BudgetBillCategory } from '../../../enums'

	export let now: dayjs.Dayjs
	export let index: number
	export let monthBudget: dayjs.Dayjs
	export let daysMonth: number[]
	export let data: BudgetBill
	export let errors: {
		description: FelteError
		amount: FelteError
		shared: FelteError
		complete: FelteError
	}

	const dispatch = createEventDispatcher<{
		delete: { index: number; id: number; description: string }
	}>()
	const prefixFieldName = `bills.${index}`
	let optionRegister = 0

	function handleDelete() {
		dispatch('delete', {
			index,
			id: data.id,
			description: data.description
		})
	}

	function handleShowOption(option: number) {
		optionRegister = optionRegister != option ? option : 0
	}

	function handleRegisterBill({ detail }: { detail: { payment: number } }) {
		data.payment += detail.payment
	}

	function handleChangeTotalShared({ detail }: { detail: number }) {
		data.totalShared = detail
	}

	$: pending = data.complete ? 0 : data.amount - data.payment
</script>

<article
	class="bg-gray-200 p-[6px] flex flex-col items-center gap-2 border-b-2 border-b-gray-300 border-l-[5px] border-l-white"
>
	<section class="w-full grid grid-cols-4 gap-2">
		<Input
			id={`${prefixFieldName}.description`}
			name={`${prefixFieldName}.description`}
			placeholder="Descripción"
			errors={errors.description}
			className="col-span-4 md:col-span-2 lg:col-span-1"
		/>
		<Input
			id={`${prefixFieldName}.amount`}
			name={`${prefixFieldName}.amount`}
			placeholder="Monto ($)"
			type="number"
			errors={errors.amount}
			className="col-span-4 md:col-span-2 lg:col-span-1"
		/>
		<SummaryValue
			icon="cash-register w-5"
			title="Pago realizado"
			value={data.payment}
			className="!text-sm col-span-2 lg:col-span-1"
		/>
		<div class="relative flex items-center group">
			<SummaryValue
				icon="file-invoice-dollar w-5"
				title="Pendiente"
				value={pending}
				className="!text-sm col-span-2 lg:col-span-1"
			/>
			{#if data.shared}
				<div
					class="absolute top-full lg:top-[85%] w-full flex-col items-center hidden mb-6 group-hover:flex"
				>
					<div class="w-2 h-2 rotate-45 bg-gray-600" />
					<span
						class="relative -mt-1 z-10 p-2 text-xs leading-none text-white whitespace-nowrap bg-gray-600 shadow-lg rounded-xl"
					>
						Compartido: {pending != 0 ? pending + data.totalShared : 0}
					</span>
				</div>
			{/if}
		</div>

		<div
			class="ml-1 col-span-4 lg:col-span-2 flex gap-1 items-center transition-all duration-75 text-sm text-gray-500"
			class:text-red-500={data.dueDate != 0 &&
				now.month() === monthBudget.month() &&
				now.date() > Number(data.dueDate)}
		>
			<span class="leading-none">Vencimiento</span>
			<select
				id={`${prefixFieldName}.dueDate`}
				name={`${prefixFieldName}.dueDate`}
				class="bg-gray-300 text-center border-none text-xs p-1 leading-none rounded font-semibold min-w-[20px] shadow-inner shadow-gray-400 appearance-none bg-none outline-none"
			>
				<option value="">N/A</option>
				{#each daysMonth as day}
					<option value={day.toString()}>{day}</option>
				{/each}
			</select>
			<span class="leading-none">de {monthBudget.format('MMMM')}</span>
		</div>
		<InputSwitch
			id={`${prefixFieldName}.shared`}
			name={`${prefixFieldName}.shared`}
			text="Compartido"
			errors={errors.shared}
			className="ml-1 col-span-2 lg:col-span-1"
		/>
		<InputSwitch
			id={`${prefixFieldName}.complete`}
			name={`${prefixFieldName}.complete`}
			text="Completo"
			errors={errors.complete}
			className="ml-1 col-span-2 lg:col-span-1"
		/>
	</section>

	<section class="flex items-center space-x-1 sm:-space-x-2 hover:space-x-1">
		<select
			id={`${prefixFieldName}.category`}
			name={`${prefixFieldName}.category`}
			class="h-[23px] p-1 pr-7 leading-none rounded border-none outline-none text-xs"
			bind:value={data.category}
		>
			<option value="" disabled>Seleccione</option>
			<option value={BudgetBillCategory.HOUSE}>Hogar</option>
			<option value={BudgetBillCategory.ENTERTAINMENT}>Entretenimiento</option>
			<option value={BudgetBillCategory.PERSONAL}>Personal</option>
			<option value={BudgetBillCategory.VEHICLE_TRANSPORTATION}>Vehículo o Transporte</option>
			<option value={BudgetBillCategory.EDUCATION}>Educación</option>
			<option value={BudgetBillCategory.SERVICES}>Servicios</option>
			<option value={BudgetBillCategory.SAVING}>Ahorros</option>
			<option value={BudgetBillCategory.OTHERS}>Otros</option>
		</select>
		<ButtonRounded
			textColor="text-blue-800"
			backgroundColor="bg-blue-300"
			activeBackgroundColor="active:bg-blue-200"
			on:click={() => handleShowOption(1)}
		>
			<i class="fa-solid fa-plus" slot="right" />
		</ButtonRounded>
		{#if data.shared}
			<ButtonRounded
				textColor="text-blue-800"
				backgroundColor="bg-blue-300"
				activeBackgroundColor="active:bg-blue-200"
				on:click={() => handleShowOption(2)}
			>
				<i class="fa-solid fa-share-nodes" slot="right" />
			</ButtonRounded>
		{/if}
		<ButtonRounded
			textColor="text-red-800"
			backgroundColor="bg-red-200"
			activeBackgroundColor="active:bg-red-200"
			on:click={handleDelete}
		>
			<i class="fa-solid fa-trash" slot="left" />
		</ButtonRounded>
	</section>
</article>

{#if optionRegister == 1}
	<PopupBillRegister
		budgetBillId={data.id}
		pendingBill={pending}
		on:click={() => handleShowOption(1)}
		on:add={handleRegisterBill}
	/>
{:else if optionRegister == 2}
	<PopupBillShared
		budgetBillId={data.id}
		on:click={() => handleShowOption(2)}
		on:changeTotal={handleChangeTotalShared}
	/>
{/if}
