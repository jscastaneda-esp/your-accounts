<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import ButtonRounded from './ButtonRounded.svelte';
	import Input from './Input.svelte';
	import ConfirmPopup from './ConfirmPopup.svelte';
	import type { ConfirmPopupInfo, FelteError, FelteOptionalError } from '../types';

	export let index: number;
	export let id: number | null | undefined;
	export let errors: {
		id?: FelteOptionalError;
		name: FelteError;
		amount: FelteError;
		budget_id?: FelteOptionalError;
	};

	const dispatch = createEventDispatcher();
	const prefixFieldName = `availables.${index}`;
	const confirmPopupInfo: ConfirmPopupInfo = {
		show: false,
		question: '¿Está seguro que desea eliminar el registro?'
	};

	function del() {
		confirmPopupInfo.show = true;
	}

	function handlePopUpAccept() {
		dispatch('delete', {
			id,
			index
		});
		handlePopUpCancel();
	}

	function handlePopUpCancel() {
		confirmPopupInfo.show = false;
	}
</script>

<article
	class="bg-gray-200 p-[6px] grid grid-cols-6 gap-2 items-center border-b-2 border-b-gray-300"
>
	<Input
		id={`${prefixFieldName}.name`}
		name={`${prefixFieldName}.name`}
		placeholder="Nombre"
		className="col-span-3"
		errors={errors.name}
	/>
	<Input
		id={`${prefixFieldName}.amount`}
		name={`${prefixFieldName}.amount`}
		placeholder="Monto ($)"
		type="number"
		className="col-span-2"
		errors={errors.amount}
	/>
	<div class="flex justify-center">
		<ButtonRounded
			textColor="text-red-500"
			backgroundColor="bg-red-300"
			activeBackgroundColor="active:bg-red-200"
			className="col-span-1"
			on:click={del}
		>
			<i class="fa-solid fa-trash" slot="left" />
		</ButtonRounded>
	</div>
</article>

{#if confirmPopupInfo.show}
	<ConfirmPopup {...confirmPopupInfo} on:accept={handlePopUpAccept} on:cancel={handlePopUpCancel} />
{/if}
