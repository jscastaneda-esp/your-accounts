<script lang="ts">
	import CardBudget from './CardBudget.svelte';
	import ComposeHeaderCardBudget from './ComposeHeaderCardBudget.svelte';
	import SummaryValue from './SummaryValue.svelte';

	let show = false;
</script>

<div class="px-1">
	<CardBudget showBody={show}>
		<ComposeHeaderCardBudget
			slot="header"
			iconAction={show ? 'caret-up' : 'caret-down'}
			on:click={() => (show = !show)}
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
		<div slot="body">TODO</div>
	</CardBudget>
</div>
