<script lang="ts">
	import type { FelteError } from '$lib/types'
	import { generateUniqueId } from '$utils/string.utils'
	import { onMount } from 'svelte'

	export let id: string
	export let name: string
	export let label: string | null = null
	export let alt: string | null = null
	export let classNameLabel = ''
	export let classNameSelect = ''
	export let disabled = false
	export let errors: FelteError = null

	onMount(() => {
		id = generateUniqueId(id)
	})
</script>

<fieldset class="form-control w-full" {disabled}>
	{#if label}
		<label class="label" for={id}>
			<span class={`label-text ${classNameLabel}`}>{label}</span>
			{#if alt}
				<span class={`label-text-alt ${classNameLabel}`}>{alt}</span>
			{/if}
		</label>
	{/if}
	<select
		{id}
		{name}
		class={`select select-bordered w-full ${classNameSelect}`}
		class:select-error={errors}
	>
		<slot />
	</select>
	<span class="label justify-start gap-1 text-error">
		{#if errors}
			<i class="bx bxs-error-alt" />
		{/if}
		<span class="label-text-alt" class:text-transparent={!errors} class:text-error={errors}>
			{errors}
		</span>
	</span>
</fieldset>
