<script lang="ts">
	// Enums, Types, Utilities
	import { goto } from '$app/navigation';
	import type { ConfirmPopupInfo } from '$lib/types/ConfirmPopupInfo';
	import { createForm } from 'felte';
	import { validator } from '@felte/validator-yup';
	import yup, { defaultText, defaultNumber } from '$lib/utils/yup.utils';

	// Components
	import Input from '$lib/components/Input.svelte';
	import ButtonLink from '$lib/components/ButtonLink.svelte';
	import ConfirmPopup from '$lib/components/ConfirmPopup.svelte';
	import SummaryValue from '$lib/components/SummaryValue.svelte';
	import Transactions from '$lib/components/Transactions.svelte';
	import CardBudgetAvailable from '$lib/components/CardBudgetAvailable.svelte';
	import CardBudgetBills from '$lib/components/CardBudgetBills.svelte';
	import CardBudgetStadistics from '$lib/components/CardBudgetStadistics.svelte';

	// Form Definition
	const validationSchema = yup.object().shape({
		name: defaultText.max(40),
		month: defaultText.matches(new RegExp('^\\d{4}-\\d{2}$')),
		fixed_income: defaultNumber.min(0).max(9999999999.99),
		additional_income: defaultNumber.min(0).max(9999999999.99)
	});
	const {
		form: formMain,
		errors,
		isValid: isValidMain
	} = createForm({
		initialValues: {
			name: '',
			month: '',
			fixed_income: 0,
			additional_income: 0
		},
		extend: [validator({ schema: validationSchema })]
	});

	let isValidAvailables = true;
	let loading = false;
	let showSummary = false;
	const confirmPopupInfo: ConfirmPopupInfo = {
		show: false,
		question: '¿Realmente desea salir?',
		description: 'Al salir se pueden perder cambios. Se recomienda primero guardar'
	};

	function handleSave() {
		alert('Guardando');
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

	function handleValidAvailables({ detail }: { detail: { isValid: boolean } }) {
		isValidAvailables = detail.isValid;
	}
</script>

{#if loading}
	<div class="px-2 py-3 flex flex-col gap-[10px] animate-pulse">
		<section class="px-1 flex justify-between">
			<div class="bg-slate-400 h-6 w-14 rounded-lg" />
			<div class="bg-slate-400 h-6 w-14 rounded-lg" />
		</section>
		<div
			class="w-full grid grid-cols-[repeat(auto-fit,_minmax(294px,_1fr))] gap-[6px] gap-x-5 p-1 border-dotted border-gray-500 border-2"
		>
			<div class="bg-slate-400 h-12 w-full" />
			<div class="bg-slate-400 h-12 w-full" />
			<div class="bg-slate-400 h-12 w-full" />
			<div class="bg-slate-400 h-12 w-full" />
		</div>
		<section class="grid grid-cols-[repeat(auto-fit,_minmax(294px,_1fr))] gap-[10px]">
			<div class="px-1">
				<div class="bg-slate-400 h-14 w-full px-1 rounded-lg" />
			</div>
			<div class="px-1">
				<div class="bg-slate-400 h-16 w-full px-1 rounded-lg" />
			</div>
		</section>
		<div class="px-1">
			<div class="bg-slate-400 h-12 w-full px-1 rounded-lg" />
		</div>
	</div>

	<div class="fixed flex flex-col bottom-0 w-full animate-pulse">
		<section class="flex justify-end p-3">
			<div class="bg-slate-400 w-10 h-10 rounded-full" />
		</section>
		<div class="min-h-[33px] bg-slate-400">
			<div class="hidden md:grid h-20" />
		</div>
	</div>
{:else}
	<div class="px-2 py-3 flex flex-col gap-[10px] mb-[5.3rem] md:mb-[7.3rem]">
		<section class="px-1 flex justify-between">
			<ButtonLink
				text="Guardar"
				className="text-gray-500 before:bg-gray-500 text-base"
				disabled={!$isValidMain || !isValidAvailables}
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
			use:formMain
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
				id="fixed_income"
				name="fixed_income"
				placeholder="Ingreso fijo ($)"
				type="number"
				errors={$errors.fixed_income}
			/>
			<Input
				id="additional_income"
				name="additional_income"
				placeholder="Ingreso adicional ($)"
				type="number"
				errors={$errors.additional_income}
			/>
		</form>
		<section class="grid grid-cols-[repeat(auto-fit,_minmax(294px,_1fr))] gap-[10px]">
			<CardBudgetAvailable list={[]} on:isValid={handleValidAvailables} />
			<CardBudgetBills />
		</section>
		<CardBudgetStadistics />
	</div>

	<div class="fixed flex flex-col bottom-0 w-full">
		<Transactions />
		<div
			class="flex flex-col min-h-[33px] shadow-[1px_0_3px_0_rgb(0_0_0_/_0.1)] shadow-gray-700 bg-white"
		>
			<div
				class="hidden md:grid grid-cols-[repeat(auto-fit,_minmax(136px,_1fr))] items-center gap-y-[6px] gap-x-3 p-3 pb-[6px] md:pb-3"
				class:!grid={showSummary}
			>
				<SummaryValue
					icon="cash-register w-5"
					title="Pago estimado"
					value={1000000}
					className="!text-sm"
				/>
				<SummaryValue
					icon="circle-dollar-to-slot w-5"
					title="Saldo estimado"
					value={1000000}
					className="!text-sm"
				/>
				<SummaryValue icon="coins w-5" title="Saldo total" value={-900000} className="!text-sm" />
				<SummaryValue
					icon="scale-unbalanced-flip w-5"
					title="Descuadre"
					value={-100000}
					className="!text-sm"
				/>
				<SummaryValue
					icon="triangle-exclamation"
					title="Registrar"
					value={0}
					className="!text-lg font-bold"
				/>
			</div>
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
		</div>
	</div>

	{#if confirmPopupInfo.show}
		<ConfirmPopup
			{...confirmPopupInfo}
			on:accept={handlePopUpAccept}
			on:cancel={handlePopUpCancel}
		/>
	{/if}
{/if}
