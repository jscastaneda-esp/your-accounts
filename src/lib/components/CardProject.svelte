<script lang="ts">
	import budgetImage from '../assets/images/budget.png';

	import { createEventDispatcher } from 'svelte';
	import CardBase from './CardBase.svelte';
	import { TypeProject } from '$lib/enums/TypeProject.enum';
	import { zeroPad } from '$lib/utils/numberFormat.utils';
	import CardValue from './CardValue.svelte';

	export let id: number;
	export let name: string;
	export let type: TypeProject;

	const dispatch = createEventDispatcher();
	let img: string | undefined = undefined;
	let additionalName: string | undefined = undefined;

	if (TypeProject.BUDGET == type) {
		img = budgetImage;
		additionalName = `${zeroPad($$props.month, 2)}/${$$props.year}`;
	}
</script>

<CardBase {img}>
	<section class="w-full flex justify-end">
		<span
			class="flex justify-center items-center gap-1 rounded-full min-w-[43px] max-w-max py-[3px] px-1 text-[10px] transition-all hover:scale-110 cursor-pointer"
			class:bg-blue-300={TypeProject.BUDGET == type}
			on:click={() => dispatch('edit', id)}
		>
			#{id}
			<i class="fa-solid fa-pen" />
		</span>
	</section>
	<header class="flex flex-col -mt-1 mb-1 bg-white w-max">
		<section class="flex items-end gap-1">
			<span class="text-black text-xl tracking-wide font-bold">{name}</span>
			{#if additionalName}
				<span class="text-xs tracking-wide font-semibold text-gray-500">{additionalName}</span>
			{/if}
		</section>
	</header>
	<main
		class="p-1 justify-center grid grid-cols-[repeat(auto-fit,_minmax(74px,_1fr))] items-center gap-1 rounded-lg bg-gray-200"
	>
		{#if TypeProject.BUDGET == type}
			<CardValue icon="wallet" title="Disponible" value={$$props.totalAvailableBalance} />
			<CardValue icon="wallet" title="Pendiente" value={$$props.totalPendingPayment} />
			<CardValue icon="wallet" title="Saldo" value={$$props.totalBalance} />
		{/if}
	</main>
	<footer class="w-full flex justify-between mt-4">
		<div>
			{#if TypeProject.BUDGET == type}
				<div class="flex gap-1 -mt-3 text-[11px] items-center">
					<span class="min-w-[18px] bg-gray-200 text-center p-1 leading-none rounded font-semibold">
						{$$props.pendingBills}
					</span>
					<span class="leading-none text-gray-500">Pagos pendientes</span>
				</div>
			{/if}
		</div>
		<div class="flex items-center -space-x-3 hover:space-x-1">
			<button
				type="button"
				class="h-[30px] px-2 z-20 block text-center text-[10px] text-red-500 transition-all bg-red-300 border border-white rounded-full active:bg-red-200 hover:scale-110 focus:outline-none focus:ring"
				on:click={() => dispatch('delete', { id, type })}
			>
				<span class="font-bold tracking-wide">Borrar</span>
				<i class="fa-solid fa-trash" />
			</button>
			<button
				type="button"
				class="h-[30px] px-2 z-10 block text-center text-[10px] text-blue-500 transition-all bg-blue-300 border border-white rounded-full active:bg-blue-200 hover:scale-110 focus:outline-none focus:ring"
				on:click={() => dispatch('clone', { id, type })}
			>
				<i class="fa-solid fa-copy" />
				<span class="font-bold tracking-wide">Duplicar</span>
			</button>
		</div>
	</footer>
</CardBase>
