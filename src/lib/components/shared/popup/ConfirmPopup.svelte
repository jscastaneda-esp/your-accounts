<script lang="ts">
	import BasePopup from './BasePopup.svelte'
	import BaseButton from '../buttons/BaseButton.svelte'
	import type ConfirmPopupInfo from '$lib/classes/ConfirmPopupInfo'

	export let data: ConfirmPopupInfo

	async function handleOk() {
		await Promise.resolve(data.actionOk())
		await Promise.resolve(data.actionCancel())
	}
</script>

<BasePopup open={data.show}>
	<h3 class="font-bold text-lg">{data.question}</h3>
	{#if data.description}
		<p class="py-4">{data.description}</p>
	{/if}

	<div class="modal-action">
		<BaseButton type="submit" value="Cancelar" className="btn-ghost" on:click={data.actionCancel} />
		<BaseButton type="submit" value="Aceptar" className="btn-primary" on:click={handleOk} />
	</div>
</BasePopup>
