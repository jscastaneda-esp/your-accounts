<script lang="ts">
	import CardBudget from './CardBudget.svelte';
	import SimpleHeaderCardBudget from './SimpleHeaderCardBudget.svelte';

	let show = false;
</script>

<div class="px-1">
	<CardBudget showBody={show}>
		<SimpleHeaderCardBudget
			slot="header"
			title="Estadísticas"
			iconHeader="chart-column"
			iconAction={show ? 'caret-up' : 'caret-down'}
			on:click={() => (show = !show)}
		/>
		<div slot="body">TODO</div>
	</CardBudget>
</div>
