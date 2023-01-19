<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import ButtonRounded from './ButtonRounded.svelte';
	import Input from './Input.svelte';
	import type { BudgetBill, CategoryBill, FelteError } from '../types';
	import SummaryValue from './SummaryValue.svelte';
	import type { DateTime } from 'luxon';
	import SwitchInput from './SwitchInput.svelte';
	import BillRegisterPopup from './BillRegisterPopup.svelte';
	import BillSharedPopup from './BillSharedPopup.svelte';

	export let now: DateTime;
	export let index: number;
	export let monthBudget: DateTime;
	export let daysMonth: number[];
	export let categories: CategoryBill[];
	export let data: BudgetBill;
	export let pending: number;
	export let errors: {
		description: FelteError;
		amount: FelteError;
		shared: FelteError;
		complete: FelteError;
	};

	const dispatch = createEventDispatcher<{
		delete: { index: number; id: number; description: string };
	}>();
	const prefixFieldName = `bills.${index}`;
	let optionRegister = 0;

	function handleDelete() {
		dispatch('delete', {
			index,
			id: data.id,
			description: data.description
		});
	}

	function handleShowOption(option: number) {
		optionRegister = optionRegister != option ? option : 0;
	}

	function handleRegisterBill({ detail }: { detail: { payment: number } }) {
		data.payment += detail.payment;
	}

	$: pending = data.complete ? 0 : data.amount - data.payment;
	$: category = categories.find((category) => category.id == data.categoryId);
</script>

<article
	class="bg-gray-200 p-[6px] flex flex-col items-center gap-2 border-b-2 border-b-gray-300 border-l-[5px] border-l-white"
	style={`border-left-color: ${category?.color};`}
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
		<SummaryValue
			icon="file-invoice-dollar w-5"
			title="Pendiente"
			value={pending}
			className="!text-sm col-span-2 lg:col-span-1"
		/>
		<div
			class="ml-1 col-span-4 lg:col-span-2 flex gap-1 items-center transition-all duration-75 text-sm text-gray-500"
			class:text-red-500={data.dueDate != 0 &&
				now.month === monthBudget.month &&
				now.day > data.dueDate}
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
			<span class="leading-none">de {monthBudget.monthLong}</span>
		</div>
		<SwitchInput
			id={`${prefixFieldName}.shared`}
			name={`${prefixFieldName}.shared`}
			text="Compartido"
			errors={errors.shared}
			className="ml-1 col-span-2 lg:col-span-1"
		/>
		<SwitchInput
			id={`${prefixFieldName}.complete`}
			name={`${prefixFieldName}.complete`}
			text="Completo"
			errors={errors.complete}
			className="ml-1 col-span-2 lg:col-span-1"
		/>
	</section>

	<section class="flex items-center space-x-1 sm:-space-x-2 hover:space-x-1">
		<select
			id={`${prefixFieldName}.categoryId`}
			name={`${prefixFieldName}.categoryId`}
			class="h-[23px] p-1 pr-7 leading-none rounded border-none outline-none text-xs"
			bind:value={data.categoryId}
		>
			<option value="" disabled>Seleccione</option>
			{#each categories as { id, name }}
				<option value={id.toString()}>{name}</option>
			{/each}
		</select>
		<ButtonRounded
			textColor="text-blue-500"
			backgroundColor="bg-blue-300"
			activeBackgroundColor="active:bg-blue-200"
			on:click={() => handleShowOption(1)}
		>
			<i class="fa-solid fa-plus" slot="right" />
		</ButtonRounded>
		{#if data.shared}
			<ButtonRounded
				textColor="text-blue-500"
				backgroundColor="bg-blue-300"
				activeBackgroundColor="active:bg-blue-200"
				on:click={() => handleShowOption(2)}
			>
				<i class="fa-solid fa-share-nodes" slot="right" />
			</ButtonRounded>
		{/if}
		<ButtonRounded
			textColor="text-red-500"
			backgroundColor="bg-red-300"
			activeBackgroundColor="active:bg-red-200"
			on:click={handleDelete}
		>
			<i class="fa-solid fa-trash" slot="left" />
		</ButtonRounded>
	</section>
</article>

{#if optionRegister == 1}
	<BillRegisterPopup
		budgetBillId={data.id}
		pendingBill={pending}
		on:click={() => handleShowOption(1)}
		on:add={handleRegisterBill}
	/>
{:else if optionRegister == 2}
	<!-- FIXME PENDIENTE Tener en cuenta los compartidos -->
	<BillSharedPopup budgetBillId={data.id} on:click={() => handleShowOption(2)} />
{/if}
