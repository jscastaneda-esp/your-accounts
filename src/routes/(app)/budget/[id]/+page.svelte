<script lang="ts">
	// Enums, Types, Utilities
	import { onDestroy, onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import type { ConfirmPopupInfo } from '$lib/types';
	import { createForm } from 'felte';
	import { validator } from '@felte/validator-yup';
	import yup, { defaultText, defaultNumber } from '$lib/utils/yup.utils';
	import { zeroPad } from '$lib/utils/numberFormat.utils';
	import type { BaseBudget, Budget } from '$lib/interfaces/Budget';
	import Toast from '$lib/utils/toast.utils';
	import { HttpStatus } from '$lib/enums';

	// Components
	import Input from '$lib/components/Input.svelte';
	import ButtonLink from '$lib/components/ButtonLink.svelte';
	import ConfirmPopup from '$lib/components/ConfirmPopup.svelte';
	import SummaryValue from '$lib/components/SummaryValue.svelte';
	import Transactions from '$lib/components/Transactions.svelte';
	import CardBudgetAvailable from '$lib/components/CardBudgetAvailable.svelte';
	import CardBudgetBills from '$lib/components/CardBudgetBills.svelte';
	import CardBudgetStatistics from '$lib/components/CardBudgetStatistics.svelte';
	import ScreenLoading from '$lib/components/ScreenLoading.svelte';

	export let data: Budget;

	onMount(() => {
		interval = setInterval(() => {
			handleSave();
		}, 30000);
	});

	onDestroy(() => {
		clearInterval(interval);
	});

	let loading = false;
	let showSummary = false;
	let interval: ReturnType<typeof setInterval>;
	let changes: { field: keyof BaseBudget; newValue: string | number }[] = [];
	let isValidAvailable = false;
	let isValidBills = false;
	const confirmPopupInfo: ConfirmPopupInfo = {
		show: false,
		question: '¿Realmente desea salir?',
		description: 'Al salir se pueden perder cambios. Se recomienda primero guardar'
	};

	// Form Definition
	const validationSchema = yup.object().shape({
		id: defaultNumber.min(1),
		name: defaultText.max(40),
		month: defaultText.matches(new RegExp('^\\d{4}-\\d{2}$')),
		fixedIncome: defaultNumber.min(0).max(9999999999.99),
		additionalIncome: defaultNumber.min(0).max(9999999999.99)
	});
	const {
		form,
		data: dataForm,
		errors,
		isValid,
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
	});

	async function handleSave() {
		if (changes.length > 0) {
			try {
				const body: { [key: string]: string | number } = {
					id: data.id
				};
				changes.forEach((change) => (body[change.field] = change.newValue));

				const response = await fetch('/api/budget', {
					method: 'PUT',
					body: JSON.stringify(body)
				});
				if (response.status != HttpStatus.OK) {
					throw new Error(response.statusText);
				}

				changes = [];
			} catch (error) {
				Toast.error('Se presento un error al guardar', true);
				throw error;
			}
		}
	}

	function handleExit() {
		confirmPopupInfo.show = true;
	}

	function handlePopUpAccept() {
		goto('/dashboard');
		confirmPopupInfo.show = false;
	}

	function handlePopUpCancel() {
		confirmPopupInfo.show = false;
	}

	function compareData() {
		if ($isValid) {
			const newData = $dataForm;
			if (newData.name != data.name) {
				changes.push({
					field: 'name',
					newValue: newData.name
				});
				data.name = newData.name;
			}

			const monthParts = newData.month.split('-');
			const year = Number(monthParts[0]);
			const month = Number(monthParts[1]);
			if (year != data.year) {
				changes.push({
					field: 'year',
					newValue: year
				});
				data.year = year;
			}

			if (month != data.month) {
				changes.push({
					field: 'month',
					newValue: month
				});
				data.month = month;
			}

			if (newData.fixedIncome != data.fixedIncome) {
				changes.push({
					field: 'fixedIncome',
					newValue: newData.fixedIncome
				});
				data.fixedIncome = newData.fixedIncome;
			}

			if (newData.additionalIncome != data.additionalIncome) {
				changes.push({
					field: 'additionalIncome',
					newValue: newData.additionalIncome
				});
				data.additionalIncome = newData.additionalIncome;
			}

			if (changes.length > 0) {
				changes = [...changes];
			}
		}
	}

	$: if ($touched) compareData();
</script>

<article class="px-2 py-3 flex flex-col gap-[10px] mb-[5.2rem] md:mb-[7.6rem]">
	<section class="px-1 flex justify-between">
		<ButtonLink
			text="Guardar"
			className="text-gray-500 before:bg-gray-500 text-base"
			disabled={!$isValid || !isValidAvailable || !isValidBills || changes.length > 0}
			on:click={handleSave}
		>
			<i class="fa-solid fa-floppy-disk" />
		</ButtonLink>
		<ButtonLink
			text="Salir"
			className="text-gray-500 before:bg-gray-500 text-base"
			on:click={handleExit}
		>
			<i class="fa-solid fa-rotate-left" />
		</ButtonLink>
	</section>
	<form
		class="w-full grid grid-cols-[repeat(auto-fit,_minmax(294px,_1fr))] gap-[6px] gap-x-5 p-1 border-dotted border-gray-500 border-2"
		use:form
	>
		<Input id="name" name="name" placeholder="Nombre" errors={$errors.name} />
		<Input
			id="month"
			name="month"
			placeholder="Mes (aaaa-MM)"
			type="month"
			errors={$errors.month}
		/>
		<Input
			id="fixedIncome"
			name="fixedIncome"
			placeholder="Ingreso fijo ($)"
			type="number"
			errors={$errors.fixedIncome}
		/>
		<Input
			id="additionalIncome"
			name="additionalIncome"
			placeholder="Ingreso adicional ($)"
			type="number"
			errors={$errors.additionalIncome}
		/>
	</form>
	{$isValid}
	{isValidAvailable}
	{isValidBills}
	{changes.length > 0}
	<section class="grid grid-cols-[repeat(auto-fit,_minmax(294px,_1fr))] gap-[10px]">
		<CardBudgetAvailable
			bind:isValidForm={isValidAvailable}
			budgetId={data.id}
			list={data.availableBalances}
		/>
		<!-- <CardBudgetBills bind:isValidForm={isValidBills} list={[]} /> -->
	</section>
	<CardBudgetStatistics />
</article>

<footer class="fixed bottom-0 flex flex-col w-full">
	<div class="relative">
		<Transactions />
	</div>
	<article
		class="flex flex-col min-h-[33px] shadow-[1px_0_3px_0_rgb(0_0_0_/_0.1)] shadow-gray-700 bg-white"
	>
		<section
			class="hidden md:grid grid-cols-[repeat(auto-fit,_minmax(136px,_1fr))] items-center gap-y-[6px] gap-x-3 p-3 pb-[6px] md:pb-3"
			class:!grid={showSummary}
		>
			<SummaryValue
				icon="cash-register w-5"
				title="Pago estimado"
				value={data.total}
				className="!text-sm"
			/>
			<SummaryValue
				icon="circle-dollar-to-slot w-5"
				title="Saldo estimado"
				value={data.estimatedBalance}
				className="!text-sm"
			/>
			<SummaryValue
				icon="coins w-5"
				title="Saldo total"
				value={data.totalBalance}
				className="!text-sm"
			/>
			<SummaryValue
				icon="scale-unbalanced-flip w-5"
				title="Descuadre"
				value={data.totalBalance - data.estimatedBalance}
				className="!text-sm"
			/>
			<SummaryValue
				icon="triangle-exclamation"
				title="Registrar"
				value={0}
				className="!text-lg font-bold"
			/>
		</section>
		<button
			class="flex flex-col items-center justify-center h-[33px] md:hidden"
			on:click={() => (showSummary = !showSummary)}
		>
			<i
				class="fa-solid fa-angles-up text-xs text-blue-400 transition-transform"
				class:rotate-180={showSummary}
			/>
			<span class="text-gray-500 text-[10px] leading-none"
				>{#if showSummary}
					Ocultar resumen
				{:else}
					Mostrar resumen
				{/if}
			</span>
		</button>
	</article>
</footer>

{#if loading}
	<ScreenLoading />
{/if}

<ConfirmPopup
	show={confirmPopupInfo.show}
	question={confirmPopupInfo.question}
	description={confirmPopupInfo.description}
	on:accept={handlePopUpAccept}
	on:cancel={handlePopUpCancel}
/>
