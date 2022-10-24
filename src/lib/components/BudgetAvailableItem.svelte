<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import ButtonRounded from './ButtonRounded.svelte';
	import Input from './Input.svelte';
	import ConfirmPopup from './ConfirmPopup.svelte';
	import type { ConfirmPopupInfo } from '../types/ConfirmPopupInfo';

	export let index: number;
	export let id: number | null | undefined;
	export let errors: { name: string[] | null | undefined; amount: string[] | null | undefined };

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
	}

	function handlePopUpCancel() {
		confirmPopupInfo.show = false;
	}
</script>

<article
	class="bg-gray-200 p-[6px] flex justify-between items-center gap-2 border-b-2 border-gray-300"
>
	<section class="w-full grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-x-2">
		<Input
			id={`${prefixFieldName}.name`}
			name={`${prefixFieldName}.name`}
			placeholder="Nombre"
			errors={errors.name}
		/>
		<Input
			id={`${prefixFieldName}.amount`}
			name={`${prefixFieldName}.amount`}
			placeholder="Monto ($)"
			type="number"
			errors={errors.amount}
		/>
	</section>
	<ButtonRounded
		textColor="text-red-500"
		backgroundColor="bg-red-300"
		activeBackgroundColor="active:bg-red-200"
		className="w-[30px]"
		on:click={del}
	>
		<i class="fa-solid fa-trash" slot="left" />
	</ButtonRounded>
</article>

{#if confirmPopupInfo.show}
	<ConfirmPopup {...confirmPopupInfo} on:accept={handlePopUpAccept} on:cancel={handlePopUpCancel} />
{/if}
