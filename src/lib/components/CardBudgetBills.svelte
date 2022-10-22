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
					icon={`file-invoice-dollar ${show ? 'w-4' : 'w-5'}`}
					title="Pendiente"
					value={1000000}
					className={show ? 'text-xs' : 'text-base'}
				/>
				<SummaryValue
					icon={`dollar-sign ${show ? 'w-4' : 'w-5'}`}
					title="Pago total"
					value={100000}
					className={show ? 'text-xs' : 'text-base'}
				/>
			</svelte:fragment>
			<div
				slot="title-additional"
				class="flex gap-1 mt-1 items-center transition-all duration-75"
				class:text-[11px]={!show}
				class:text-[9px]={show}
			>
				<span
					class="bg-gray-200 text-center p-1 leading-none rounded font-semibold"
					class:min-w-[18px]={!show}
					class:min-w-[16px]={show}
				>
					3
				</span>
				<span class="leading-none text-gray-500">Pagos pendientes</span>
			</div>
		</ComposeHeaderCardBudget>
		<div slot="body">TODO</div>
	</CardBudget>
</div>
