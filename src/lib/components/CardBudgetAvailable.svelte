<script lang="ts">
	import CardBudget from './CardBudget.svelte';
	import ComposeHeaderCardBudget from './ComposeHeaderCardBudget.svelte';
	import SummaryValue from './SummaryValue.svelte';
	import BudgetAvailableItem from './BudgetAvailableItem.svelte';
	import { createForm } from 'felte';
	import { validator } from '@felte/validator-yup';
	import yup, { defaultText, defaultNumber } from '../utils/yup.utils';
	import { createEventDispatcher } from 'svelte';
	import Toast from '$lib/utils/toast.utils';

	export let list: any[];

	const dispatch = createEventDispatcher();
	let show = false;

	// Form Definition
	const validationSchema = yup.object().shape({
		availables: yup.array().of(
			yup.object().shape({
				name: defaultText.max(40),
				amount: defaultNumber.min(0).max(9999999999.99)
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
			addField('availables', { name: '', amount: 0 }, availables.length);
		}
	}

	function del({ detail }: { detail: { id: number; index: number } }) {
		if (detail.id) {
			alert('Eliminar');
		}

		unsetField(`availables.${detail.index}`);
	}

	$: availables = $data.availables;
	$: dispatch('isValid', { isValid: $isValid });
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
				<BudgetAvailableItem
					{...available}
					{index}
					errors={$errors.availables?.[index]}
					on:delete={del}
				/>
			{/each}
			{#if $isValid}
				<button
					type="button"
					class="bg-gray-200 py-[6px] px-3 flex items-center gap-1 text-xs text-gray-500 shadow-inner"
					on:click={add}
				>
					<i class="fa-solid fa-plus" />
					<span>Agregar disponible</span>
				</button>
			{/if}
		</form>
	</CardBudget>
</div>
