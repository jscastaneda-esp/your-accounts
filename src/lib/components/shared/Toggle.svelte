<script lang="ts">
	import { onMount } from 'svelte'

	export let id: string
	export let name: string
	export let label: string
	export let disabled = false

	onMount(() => {
		if (crypto.randomUUID) {
			id = `${id}_${crypto.randomUUID()}`
		} else {
			id = `${id}_${new Date().getTime()}`
		}
	})
</script>

<fieldset class="form-control w-full" {disabled}>
	<label class="label cursor-pointer">
		{#if label}
			<span class="label-text">{label}</span>
		{/if}
		<input type="checkbox" {id} {name} class="toggle toggle-primary" on:change />
	</label>
</fieldset>
