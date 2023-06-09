<script lang="ts">
	import type { FelteError } from '../../types'
	import { onMount } from 'svelte'

	export let id: string
	export let name: string
	export let label: string
	export let alt: string | null = null
	export let type: 'text' | 'number' | 'email' | 'password' | 'month' = 'text'
	export let disabled = false
	export let errors: FelteError = null

	onMount(() => {
		if (crypto.randomUUID) {
			id = `${id}_${crypto.randomUUID()}`
		} else {
			id = `${id}_${new Date().getTime()}`
		}
	})
</script>

<fieldset class="form-control w-full" {disabled}>
	<label class="label" for={id}>
		<span class="label-text">{label}</span>
		{#if alt}
			<span class="label-text-alt">{alt}</span>
		{/if}
	</label>
	<input
		{id}
		{name}
		{type}
		placeholder={label}
		class="input input-bordered w-full"
		class:input-error={errors}
		step={type === 'number' ? '0.01' : undefined}
	/>
	{#if errors}
		<span class="label justify-start gap-1 text-error">
			<i class="bx bxs-error-alt" />
			<span class="label-text-alt text-error">{errors}</span>
		</span>
	{/if}
</fieldset>
