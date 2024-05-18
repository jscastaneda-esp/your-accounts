<script lang="ts">
	import type { FelteError } from '$lib/types'
	import { generateUniqueId } from '$utils/string.utils'
	import { onMount } from 'svelte'
	import Icon from './Icon.svelte'

	export let id: string
	export let name: string
	export let label: string | null = null
	export let className = ''
	export let disabled = false
	export let errors: FelteError = null

	onMount(() => {
		id = generateUniqueId(id)
	})
</script>

<fieldset class="form-control w-full" {disabled} {...$$restProps}>
	<select
		{id}
		{name}
		class="select select-sm select-ghost w-full {className}"
		class:select-error={errors}
	>
		<option disabled selected>{label}</option>
		<slot />
	</select>
	{#if errors}
		<span class="label justify-start gap-1 text-error">
			<Icon>
				<path
					d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
				/>
			</Icon>

			<span class="label-text-alt text-error">
				{errors}
			</span>
		</span>
	{/if}
</fieldset>
