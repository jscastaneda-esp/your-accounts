<script lang="ts">
	import { generateUniqueId } from '$utils/string.utils'
	import type { FelteError } from '$lib/types'
	import { onMount } from 'svelte'

	export let id: string
	export let name: string
	export let label: string | null = null
	export let placeholder: string | null = null
	export let alt: string | null = null
	export let type: 'text' | 'number' | 'email' | 'password' | 'month' | 'search' = 'text'
	export let disabled = false
	export let errors: FelteError = null

	onMount(() => {
		id = generateUniqueId(id)
	})
</script>

<fieldset class="form-control w-full" {disabled} {...$$restProps}>
	{#if label}
		<label class="label" for={id}>
			<span class="label-text">{label}</span>
			{#if alt}
				<span class="label-text-alt">{alt}</span>
			{/if}
		</label>
	{/if}
	<input
		{id}
		{name}
		{type}
		placeholder={placeholder ?? label}
		class="input input-bordered w-full"
		class:input-error={errors}
		step={type === 'number' ? '0.01' : undefined}
	/>
	<span class="label justify-start gap-1 text-error">
		{#if errors}
			<i class="bx bxs-error-alt" />
		{/if}
		<span class="label-text-alt" class:text-transparent={!errors} class:text-error={errors}>
			{errors}
		</span>
	</span>
</fieldset>
