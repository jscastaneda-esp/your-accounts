<script lang="ts">
	export let value: string | undefined = undefined;
	export let textColor: string;
	export let backgroundColor: string;
	export let activeBackgroundColor: string;
	export let className = '';
	export let disabled = false;
</script>

<button
	type="button"
	class={`h-[30px] min-w-[30px] px-2 block text-center text-[10px] ${textColor} transition-all ${backgroundColor} border border-white rounded-full ${activeBackgroundColor} enabled:hover:scale-110 enabled:focus:outline-none enabled:focus:ring disabled:bg-gray-500/80 disabled:pointer-events-none disabled:text-gray-700 ${className}`}
	{disabled}
	on:click
>
	<slot name="left" />
	{#if value}
		<span class="font-bold tracking-wide">{value}</span>
	{/if}
	<slot name="right" />
</button>
