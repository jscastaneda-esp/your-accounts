<script lang="ts">
	import { generateUniqueId } from '$utils/string.utils'
	import type { FelteError } from '$lib/types'
	import { onMount } from 'svelte'
	import Icon from './Icon.svelte'

	export let id: string
	export let name: string
	export let placeholder: string
	export let alt: string | null = null
	export let type: 'text' | 'number' | 'email' | 'password' | 'month' | 'search' = 'text'
	export let disabled = false
	export let errors: FelteError = null
	export let prependIcon = false
	export let appendIcon = false
	export let value = ''
	export let bordered = false

	onMount(() => {
		id = generateUniqueId(id)
	})

	function typeAction(node: HTMLInputElement) {
		node.type = type
	}
</script>

<fieldset class="form-control w-full" {disabled} {...$$restProps}>
	<label
		class="input input-ghost input-sm flex items-center gap-2"
		class:input-bordered={bordered}
		class:input-error={errors}
	>
		{#if prependIcon || ($$slots.icon && !appendIcon)}
			<slot name="icon" />
		{/if}
		<input
			use:typeAction
			{id}
			{name}
			class="grow"
			{placeholder}
			step={type === 'number' ? '0.01' : undefined}
			bind:value
		/>
		{#if alt}
			<kbd class="kbd kbd-sm">{alt}</kbd>
		{/if}
		{#if appendIcon && $$slots.icon}
			<slot name="icon" />
		{/if}
	</label>
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
