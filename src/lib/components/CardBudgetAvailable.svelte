<script lang="ts">
	import CardBudget from './CardBudget.svelte';
	import ComposeHeaderCardBudget from './ComposeHeaderCardBudget.svelte';
	import SummaryValue from './SummaryValue.svelte';
	import ItemBudgetAvailable from './ItemBudgetAvailable.svelte';
	import { createForm } from 'felte';
	import { validator } from '@felte/validator-yup';
	import yup, { defaultText, defaultNumber } from '../utils/yup.utils';
	import Toast from '../utils/toast.utils';
	import type { BudgetAvailable } from '../types';

	export let isValidForm: boolean;
	export let list: BudgetAvailable[];
	export let budgetId: number;

	let show = false;

	// Form Definition
	const validationSchema = yup.object().shape({
		availables: yup.array().of(
			yup.object().shape({
				name: defaultText.max(40),
				amount: defaultNumber.min(0).max(9999999999.99),
				budgetId: defaultNumber.min(1)
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
			addField('availables', { name: '', amount: 0, budgetId }, availables.length);
		}
	}

	function del({ detail }: { detail: { id: number; index: number } }) {
		if (detail.id) {
			alert('Eliminar');
		}

		unsetField(`availables.${detail.index}`);
	}

	$: isValidForm = $isValid;
	$: availables = $data.availables;
	$: sumAvailables = $data.availables.reduce((previous, current) => previous + current.amount, 0);
</script>

<div class="px-1">
	<CardBudget showBody={show}>
		<ComposeHeaderCardBudget
			slot="header"
			iconAction={show ? 'caret-up' : 'caret-down'}
			on:click={() => {
				if (show && !$isValid) {
					Toast.warn('Completa la información', true);
					return;
				}

				show = !show;
			}}
		>
			<svelte:fragment slot="title">
				<SummaryValue
					icon={`wallet ${show ? 'w-4' : 'w-5'}`}
					title="Disponible"
					value={sumAvailables}
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
