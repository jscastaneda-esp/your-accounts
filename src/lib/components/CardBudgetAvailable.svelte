<script lang="ts">
	import { getContext } from 'svelte';
	import CardBudget from './CardBudget.svelte';
	import ComposeHeaderCardBudget from './ComposeHeaderCardBudget.svelte';
	import SummaryValue from './SummaryValue.svelte';
	import ItemBudgetAvailable from './ItemBudgetAvailable.svelte';
	import { createForm } from 'felte';
	import { validator } from '@felte/validator-yup';
	import yup, { defaultText, defaultNumber } from '../utils/yup.utils';
	import Toast from '../utils/toast.utils';
	import { Context } from '../enums';
	import type { Writable } from 'svelte/store';
	import type { BudgetAvailable, BudgetContext, BudgetMainData } from '../types';

	export let list: BudgetAvailable[];

	const dataMain: Writable<BudgetMainData> = getContext('dataMain');

	let ctx = getContext<Writable<BudgetContext>>(Context.BUDGET_DATA_AVAILABLE);
	let show = false;

	// Form Definition
	const validationSchema = yup.object().shape({
		availables: yup.array().of(
			yup.object().shape({
				name: defaultText.max(40),
				amount: defaultNumber.min(0).max(9999999999.99),
				budget_id: defaultNumber.min(1)
			})
		)
	});
	const { form, data, errors, isValid, addField, unsetField } = createForm({
		initialValues: {
			availables: list
		},
		extend: [validator({ schema: validationSchema })]
	});

	function add() {
		if ($isValid) {
			addField('availables', { name: '', amount: 0, budget_id: $dataMain.id }, availables.length);
		}
	}

	function del({ detail }: { detail: { id: number; index: number } }) {
		if (detail.id) {
			alert('Eliminar');
		}

		unsetField(`availables.${detail.index}`);
	}

	$: availables = $data.availables;
	$: $ctx = {
		isValid: $isValid,
		data: $data
	};
</script>

<div class="px-1">
	<CardBudget showBody={show}>
		<ComposeHeaderCardBudget
			slot="header"
			iconAction={show ? 'caret-up' : 'caret-down'}
			on:click={() => {
				Toast.clear();
				if (show && !$isValid) {
					Toast.warn('Completa la información');
					return;
				}

				show = !show;
			}}
		>
			<svelte:fragment slot="title">
				<SummaryValue
					icon={`wallet ${show ? 'w-4' : 'w-5'}`}
					title="Disponible"
					value={100000}
					className={show ? 'text-xs' : 'text-base'}
				/>
			</svelte:fragment>
		</ComposeHeaderCardBudget>
		<form slot="body" class="flex flex-col overflow-y-auto max-h-[210px]" use:form>
			{#each availables as available, index (`available_${index}`)}
				<ItemBudgetAvailable
					{index}
					id={available.id}
					errors={$errors.availables?.[index]}
					on:delete={del}
				/>
			{/each}
			{#if $isValid}
				<button
					type="button"
					class="bg-gray-200 py-[6px] px-3 flex items-center gap-1 text-xs text-gray-500 shadow-inner shadow-gray-300"
					on:click={add}
				>
					<i class="fa-solid fa-plus" />
					<span>Agregar disponible</span>
				</button>
			{/if}
		</form>
	</CardBudget>
</div>
