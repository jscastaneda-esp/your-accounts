<script lang="ts">
	import { onMount } from 'svelte'
	import BaseButton from '../buttons/BaseButton.svelte'

	export let open: boolean
	export let showCloseButton = false

	let element: HTMLDialogElement

	onMount(() => {
		element.addEventListener('close', () => {
			open = false
		})
	})

	$: if (element) {
		if (open) {
			element.showModal()
		} else {
			element.close()
		}
	}
</script>

<dialog bind:this={element} class="modal modal-bottom sm:modal-middle text-base-content">
	<form method="dialog" class="modal-box">
		{#if !showCloseButton}
			<BaseButton
				type="submit"
				value="✕"
				className="btn-sm btn-circle btn-ghost absolute right-2 top-2"
				on:click
			/>
		{/if}

		<slot />
	</form>
</dialog>
