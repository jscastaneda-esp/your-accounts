<script lang="ts">
	import { onMount } from 'svelte'
	import Button from '../buttons/Button.svelte'

	export let open: boolean
	export let showCloseButton = false
	export let preventDefaultClose = false

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
			{#if preventDefaultClose}
				<button
					class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-10"
					on:click|preventDefault
				>
					✕
				</button>
			{:else}
				<Button
					type="submit"
					value="✕"
					className="btn-sm btn-circle btn-ghost absolute right-2 top-2 z-10"
					on:click
				/>
			{/if}
		{/if}

		<slot />
	</form>
</dialog>
