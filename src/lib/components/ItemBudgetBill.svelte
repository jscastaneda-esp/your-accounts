<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import ButtonRounded from './ButtonRounded.svelte';
	import Input from './Input.svelte';
	import ConfirmPopup from './ConfirmPopup.svelte';
	import type {
		BudgetBill,
		BudgetBillShared,
		CategoryBill,
		ConfirmPopupInfo,
		FelteError,
		FelteOptionalError
	} from '../types';
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
	export let errors: {
		id?: FelteOptionalError;
		description: FelteError;
		amount: FelteError;
		payment: FelteError;
		shared: FelteError;
		due_date: FelteError;
		complete: FelteError;
		budget_id?: FelteOptionalError;
		category_id: FelteError;
	};

	const dispatch = createEventDispatcher();
	const prefixFieldName = `bills.${index}`;
	const confirmPopupInfo: ConfirmPopupInfo = {
		show: false,
		question: '¿Está seguro que desea eliminar el registro?'
	};
	let optionRegister = 0;

	function del() {
		confirmPopupInfo.show = true;
	}

	function handlePopUpAccept() {
		dispatch('delete', {
			id: data.id,
			index
		});
		handlePopUpCancel();
	}

	function handlePopUpCancel() {
		confirmPopupInfo.show = false;
	}

	function handleShowOption(option: number) {
		if (optionRegister != option) {
			optionRegister = option;
		} else {
			optionRegister = 0;
		}
	}

	$: pending = data.amount - data.payment;
	$: category = categories.find((category) => category.id == data.category_id);
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
			class:text-red-500={data.due_date != 0 &&
				now.month === monthBudget.month &&
				now.day > data.due_date}
		>
			<span class="leading-none">Vencimiento</span>
			<select
				id={`${prefixFieldName}.due_date`}
				name={`${prefixFieldName}.due_date`}
				class="bg-gray-300 text-center border-none text-xs p-1 leading-none rounded font-semibold min-w-[20px] shadow-inner shadow-gray-400 appearance-none bg-none outline-none"
			>
				<option value="">N/A</option>
				{#each daysMonth as day (day)}
					<option value={day}>{day}</option>
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
			id={`${prefixFieldName}.category_id`}
			name={`${prefixFieldName}.category_id`}
			class="h-[23px] p-1 pr-7 leading-none rounded border-none outline-none text-xs"
		>
			<option value="" disabled>Seleccione</option>
			{#each categories as category (category.id)}
				<option value={category.id}>{category.name}</option>
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
			on:click={del}
		>
			<i class="fa-solid fa-trash" slot="left" />
		</ButtonRounded>
	</section>
</article>

{#if optionRegister == 1}
	<BillRegisterPopup pendingBill={pending} on:click={() => handleShowOption(1)} />
{/if}

{#if optionRegister == 2}
	<BillSharedPopup budgetBillId={1} list={[]} on:click={() => handleShowOption(2)} />
{/if}

{#if confirmPopupInfo.show}
	<ConfirmPopup {...confirmPopupInfo} on:accept={handlePopUpAccept} on:cancel={handlePopUpCancel} />
{/if}
