<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import budgetImage from '../../assets/images/budget.webp';
	import { goto } from '$app/navigation';
	import { TypeProjectEnum } from '../../enums';
	import { zeroPad } from '../../utils/number.utils';
	import CardBase from './CardBase.svelte';
	import SummaryValue from '../SummaryValue.svelte';
	import ButtonRounded from '../buttons/ButtonRounded.svelte';
	import type { EventDispatchProject } from '../../types';

	export let loading: boolean;
	export let id: number;
	export let name: string;
	export let type: TypeProjectEnum;

	let img: string | undefined = undefined;
	let additionalName: string | undefined = undefined;
	const dispatch = createEventDispatcher<{
		delete: EventDispatchProject;
		clone: EventDispatchProject;
	}>();

	if (TypeProjectEnum.BUDGET == type) {
		img = budgetImage;
		additionalName = `${zeroPad($$props.month, 2)}/${$$props.year}`;
	}

	async function handleEdit() {
		loading = true;
		let url = '';
		if (TypeProjectEnum.BUDGET === type) {
			url = '/budget';
		}
		await goto(`${url}/${id}`);
		loading = false;
	}

	function handleAction(action: 'delete' | 'clone') {
		dispatch(action, {
			id,
			name,
			type
		});
	}
</script>

<CardBase {img}>
	<section class="w-full flex justify-end">
		<button
			type="button"
			class="flex justify-center items-center gap-1 rounded-full min-w-[43px] max-w-max py-[3px] px-1 text-[10px] transition-all hover:scale-110 cursor-pointer"
			class:bg-blue-300={TypeProjectEnum.BUDGET == type}
			on:click={handleEdit}
		>
			#{id}
			<i class="fa-solid fa-pen" />
		</button>
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
		{#if TypeProjectEnum.BUDGET == type}
			<SummaryValue icon="wallet" title="Disponible" value={$$props.totalAvailableBalance} />
			<SummaryValue
				icon="file-invoice-dollar"
				title="Pendiente"
				value={$$props.totalPendingPayment}
			/>
			<SummaryValue icon="coins" title="Saldo" value={$$props.totalBalance} />
		{/if}
	</main>
	<footer class="w-full flex justify-between mt-4">
		<div>
			{#if TypeProjectEnum.BUDGET == type}
				<div class="flex gap-1 -mt-3 text-[11px] items-center">
					<span class="min-w-[18px] bg-gray-200 text-center p-1 leading-none rounded font-semibold">
						{$$props.pendingBills}
					</span>
					<span class="leading-none text-gray-500">Pagos pendientes</span>
				</div>
			{/if}
		</div>
		<div class="flex items-center -space-x-3 hover:space-x-1">
			<ButtonRounded
				value="Borrar"
				textColor="text-red-800"
				backgroundColor="bg-red-200"
				activeBackgroundColor="active:bg-red-200"
				on:click={() => handleAction('delete')}
			>
				<i class="fa-solid fa-trash" slot="left" />
			</ButtonRounded>
			<ButtonRounded
				value="Duplicar"
				textColor="text-blue-800"
				backgroundColor="bg-blue-300"
				activeBackgroundColor="active:bg-blue-200"
				on:click={() => handleAction('clone')}
			>
				<i class="fa-solid fa-copy" slot="right" />
			</ButtonRounded>
		</div>
	</footer>
</CardBase>
