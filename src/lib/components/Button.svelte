<script lang="ts">
	export let type: 'button' | 'submit' = 'button';
	export let value: string;
	export let className: string = '';
	export let classNameValue: string = '';
	export let disabled: boolean = false;
	export let loading: boolean = false;
</script>

<button
	{type}
	class={`bg-blue-200 hover:bg-blue-300 active:bg-blue-500 w-full flex justify-center items-center py-2 h-12 shadow-md shadow-gray-500/80 disabled:bg-gray-500/80 disabled:pointer-events-none ${className}`}
	disabled={loading || disabled}
	on:click
>
	{#if !loading}
		<slot />
		<span class={`font-bold ${classNameValue}`}>{value}</span>
	{:else}
		<svg
			class="animate-spin h-7 w-7 text-white"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
		>
			<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
			<path
				class="opacity-75"
				fill="currentColor"
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
			/>
		</svg>
	{/if}
</button>
