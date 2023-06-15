<script lang="ts">
	import Popup from './Popup.svelte'
	import Button from '../buttons/Button.svelte'
	import { confirmPopup } from '$lib/stores/shared'

	async function handleOk() {
		await Promise.resolve($confirmPopup.actionOk())
		await Promise.resolve($confirmPopup.actionCancel())
	}
</script>

<Popup open={$confirmPopup.show}>
	<h3 class="font-bold text-lg">{$confirmPopup.question}</h3>
	{#if $confirmPopup.description}
		<p class="py-4">{$confirmPopup.description}</p>
	{/if}

	<div class="modal-action">
		<Button
			type="submit"
			value="Cancelar"
			className="btn-ghost"
			on:click={$confirmPopup.actionCancel}
		/>
		<Button type="submit" value="Aceptar" className="btn-primary" on:click={handleOk} />
	</div>
</Popup>
