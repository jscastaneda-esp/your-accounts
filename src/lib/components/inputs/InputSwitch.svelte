<script lang="ts">
	import type { FelteError } from '../../types'
	import { onMount } from 'svelte'
	import { slide } from 'svelte/transition'

	export let id: string
	export let name: string
	export let text: string
	export let disabled = false
	export let errors: FelteError = null
	export let className = ''

	onMount(() => {
		if (crypto.randomUUID) {
			id = `${id}_${crypto.randomUUID()}`
		} else {
			id = `${id}_${new Date().getTime()}`
		}
	})
</script>

<fieldset {disabled} class={className}>
	<div class="flex gap-1 items-center">
		<span class="text-sm text-gray-500">{text}</span>
		<label for={id} class="relative h-6 w-10 cursor-pointer" class:pointer-events-none={disabled}>
			<input type="checkbox" {id} {name} class="peer sr-only" on:change />

			<span class="absolute inset-0 rounded-full bg-gray-300 transition" />

			<span
				class="absolute inset-0 m-1 h-4 w-4 rounded-full bg-gray-400 transition peer-checked:translate-x-4 peer-checked:bg-blue-400"
			/>
		</label>
	</div>
	{#if errors}
		<div
			transition:slide={{ duration: 150 }}
			class="grid grid-cols-[max-content_auto] items-center text-xs text-red-600 bg-red-300 opacity-90 py-1 px-2 gap-2 rounded-b"
			role="alert"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="w-4 h-4"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				stroke-width="2"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01"
				/>
			</svg>
			<span>{errors}</span>
		</div>
	{/if}
</fieldset>
