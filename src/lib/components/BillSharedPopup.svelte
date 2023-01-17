<script lang="ts">
	import { createForm } from 'felte';
	import { validator } from '@felte/validator-yup';
	import yup, { defaultText, defaultNumber } from '../utils/yup.utils';
	import Popup from './Popup.svelte';
	import Input from './Input.svelte';
	import ButtonRounded from './ButtonRounded.svelte';
	import type { BudgetBillShared, ConfirmPopupInfo } from '$lib/types';
	import CardBudget from './CardBudget.svelte';
	import ComposeHeaderCardBudget from './ComposeHeaderCardBudget.svelte';
	import SummaryValue from './SummaryValue.svelte';
	import ConfirmPopup from './ConfirmPopup.svelte';

	export let budgetBillId: number;
	export let list: BudgetBillShared[];

	const confirmPopupInfo: ConfirmPopupInfo<{ id: number; index: number } | null> = {
		show: false,
		question: '¿Está seguro que desea eliminar el registro?'
	};

	// Form Definition
	const validationSchema = yup.object().shape({
		shared: yup.array().of(
			yup.object().shape({
				description: defaultText.max(200),
				amount: defaultNumber.min(0).max(9999999999.99),
				budget_bill_id: defaultNumber.min(1)
			})
		)
	});
	const { form, data, errors, isValid, addField, unsetField } = createForm({
		initialValues: {
			shared: list
		},
		extend: [validator({ schema: validationSchema })]
	});

	function add() {
		if ($isValid) {
			addField('shared', { description: '', amount: 0, budget_bill_id: budgetBillId }, list.length);
		}
	}

	function del(item: BudgetBillShared, index: number) {
		confirmPopupInfo.show = true;
		confirmPopupInfo.detail = {
			index,
			id: Number(item.id)
		};
	}

	function handlePopUpAccept() {
		if (confirmPopupInfo.detail) {
			if (confirmPopupInfo.detail.id) {
				alert('Eliminar');
			}

			unsetField(`shared.${confirmPopupInfo.detail.index}`);
		}

		handlePopUpCancel();
	}

	function handlePopUpCancel() {
		confirmPopupInfo.show = false;
		confirmPopupInfo.detail = null;
	}

	$: list = $data.shared;
</script>

<Popup showCloseButton on:click>
	<CardBudget showBody={true} classNameContainer="w-screen sm:w-[24rem]">
		<ComposeHeaderCardBudget slot="header" clickable={false}>
			<svelte:fragment slot="title">
				<SummaryValue icon="dollar-sign w-5" title="Total" value={100000} className="text-base" />
			</svelte:fragment>
		</ComposeHeaderCardBudget>
		<form slot="body" class="flex flex-col overflow-y-auto max-h-[210px]" use:form>
			{#each list as item, index (`shared_${index}`)}
				<article
					class="bg-gray-200 p-[6px] grid grid-cols-6 gap-2 items-center border-b-2 border-b-gray-300"
				>
					<Input
						id={`shared.${index}.description`}
						name={`shared.${index}.description`}
						placeholder="Descripción"
						className="col-span-3"
						errors={$errors.shared?.[index].description}
					/>
					<Input
						id={`shared.${index}.amount`}
						name={`shared.${index}.amount`}
						placeholder="Monto ($)"
						type="number"
						className="col-span-2"
						errors={$errors.shared?.[index].amount}
					/>
					<div class="flex justify-center">
						<ButtonRounded
							textColor="text-red-500"
							backgroundColor="bg-red-300"
							activeBackgroundColor="active:bg-red-200"
							className="col-span-1"
							on:click={() => del(item, index)}
						>
							<i class="fa-solid fa-trash" slot="left" />
						</ButtonRounded>
					</div>
				</article>
			{/each}
			{#if $isValid}
				<button
					type="button"
					class="bg-gray-200 py-[6px] px-3 flex items-center gap-1 text-xs text-gray-500 shadow-inner shadow-gray-300"
					on:click={add}
				>
					<i class="fa-solid fa-plus" />
					<span>Agregar gasto compartido</span>
				</button>
			{/if}
		</form>
	</CardBudget>
</Popup>

{#if confirmPopupInfo.show}
	<ConfirmPopup
		question={confirmPopupInfo.question}
		description={confirmPopupInfo.description}
		on:accept={handlePopUpAccept}
		on:cancel={handlePopUpCancel}
	/>
{/if}
