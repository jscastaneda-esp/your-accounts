<script lang="ts">
	import type { FelteError } from '../../types'
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
		if (crypto.randomUUID) {
			id = `${id}_${crypto.randomUUID()}`
		} else {
			id = `${id}_${new Date().getTime()}`
		}
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
	{#if errors}
		<span class="label justify-start gap-1 text-error">
			<i class="bx bxs-error-alt" />
			<span class="label-text-alt text-error">{errors}</span>
		</span>
	{/if}
</fieldset>
