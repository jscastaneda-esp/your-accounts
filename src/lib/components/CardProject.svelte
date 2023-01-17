<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import budgetImage from '../assets/images/budget.png';
	import { goto } from '$app/navigation';
	import type { ConfirmPopupInfo } from '../types';
	import { HttpStatus, TypeProjectEnum } from '../enums';
	import { zeroPad } from '../utils/numberFormat.utils';
	import CardBase from './CardBase.svelte';
	import SummaryValue from './SummaryValue.svelte';
	import ButtonRounded from './ButtonRounded.svelte';
	import ConfirmPopup from './ConfirmPopup.svelte';
	import Toast from '$lib/utils/toast.utils';
	import { session } from '$lib/stores';

	export let loading: boolean;
	export let id: number;
	export let name: string;
	export let type: TypeProjectEnum;

	let img: string | undefined = undefined;
	let additionalName: string | undefined = undefined;
	const confirmPopupInfo: ConfirmPopupInfo<string | null> = {
		show: false,
		question: ''
	};
	const dispatch = createEventDispatcher<{ delete: { id: number } }>();

	if (TypeProjectEnum.BUDGET == type) {
		img = budgetImage;
		additionalName = `${zeroPad($$props.month, 2)}/${$$props.year}`;
	}

	function handleEdit() {
		let url: string = '';
		if (TypeProjectEnum.BUDGET === type) {
			url = '/budget';
		}
		goto(`${url}/${id}`);
	}

	function handleDelete() {
		confirmPopupInfo.show = true;
		confirmPopupInfo.question = '¿Realmente desea eliminar el ';
		confirmPopupInfo.detail = 'delete';

		if (TypeProjectEnum.BUDGET === type) {
			confirmPopupInfo.question += 'presupuesto?';
			confirmPopupInfo.description =
				'Se eliminará toda la información asociada y no será posible recuperarla';
		}
	}

	function handleClone() {
		confirmPopupInfo.show = true;
		confirmPopupInfo.question = '¿Realmente desea duplicar el ';
		confirmPopupInfo.detail = 'clone';

		if (TypeProjectEnum.BUDGET === type) {
			confirmPopupInfo.question += 'presupuesto?';
			confirmPopupInfo.description =
				'Se duplicará la información principal. Las transacciones no serán duplicadas';
		}
	}

	async function handlePopUpAccept() {
		loading = true;

		if (confirmPopupInfo.detail === 'clone') {
			let url: string = '';
			if (TypeProjectEnum.BUDGET === type) {
				url = '/budget';
			}

			try {
				const response = await fetch('/api/dashboard', {
					method: 'POST',
					body: JSON.stringify({
						userId: $session?.uid,
						type: TypeProjectEnum[type],
						baseId: id
					})
				});
				if (response.status != HttpStatus.OK) {
					throw new Error(response.statusText);
				}

				const body = await response.json();
				goto(`${url}/${body.id}`);
			} catch (error) {
				Toast.clear();
				Toast.error('Se presento un error al duplicar el proyecto');
				throw error;
			} finally {
				loading = false;
			}
		} else {
			try {
				const response = await fetch('/api/dashboard', {
					method: 'DELETE',
					body: JSON.stringify({
						id
					})
				});
				if (response.status != HttpStatus.OK) {
					throw new Error(response.statusText);
				}

				Toast.clear();
				Toast.success(`Se elimino exitosamente el proyecto ${name}`);
				dispatch('delete', {
					id
				});
			} catch (error) {
				Toast.clear();
				Toast.error('Se presento un error al duplicar el proyecto');
				throw error;
			} finally {
				loading = false;
			}
		}

		handlePopUpCancel();
	}

	function handlePopUpCancel() {
		confirmPopupInfo.show = false;
		confirmPopupInfo.question = '';
		confirmPopupInfo.description = undefined;
		confirmPopupInfo.detail = undefined;
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
				textColor="text-red-500"
				backgroundColor="bg-red-300"
				activeBackgroundColor="active:bg-red-200"
				on:click={handleDelete}
			>
				<i class="fa-solid fa-trash" slot="left" />
			</ButtonRounded>
			<ButtonRounded
				value="Duplicar"
				textColor="text-blue-500"
				backgroundColor="bg-blue-300"
				activeBackgroundColor="active:bg-blue-200"
				on:click={handleClone}
			>
				<i class="fa-solid fa-copy" slot="right" />
			</ButtonRounded>
		</div>
	</footer>
</CardBase>

{#if confirmPopupInfo.show}
	<ConfirmPopup {...confirmPopupInfo} on:accept={handlePopUpAccept} on:cancel={handlePopUpCancel} />
{/if}
