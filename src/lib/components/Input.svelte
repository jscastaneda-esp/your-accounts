<script lang="ts">
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';

	export let id: string;
	export let name: string;
	export let placeholder: string;
	export let type: 'text' | 'email' | 'password' = 'text';
	export let classInput = '';
	export let disabled = false;
	export let errors: string[] | null = null;

	onMount(() => {
		if (crypto.randomUUID) {
			id = `${id}_${crypto.randomUUID()}`;
		} else {
			id = `${id}_${new Date().getTime()}`;
		}
	});
</script>

<fieldset {disabled}>
	<label
		class="bg-white relative block p-2 px-3 border-2 border-gray-200 transition-all ease-in-out"
		class:bg-gray-300={disabled}
		class:border-0={errors}
		class:ring-2={errors}
		class:ring-red-500={errors}
		for={id}
	>
		<input
			class={`bg-transparent w-full px-0 pt-3.5 pb-0 text-sm placeholder-transparent border-none focus:ring-0 peer ${classInput}`}
			{id}
			{name}
			{type}
			{placeholder}
		/>

		<span
			class="absolute text-xs font-medium text-gray-500 transition-all left-3 top-2 peer-focus:text-xs peer-focus:top-2 peer-focus:translate-y-0 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm"
		>
			{placeholder}
		</span>

		<slot />
	</label>
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
