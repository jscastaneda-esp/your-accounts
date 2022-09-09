<script lang="ts">
	export let type: 'button' | 'submit' = 'button';
	export let value: string;
	export let className: string = '';
	export let classNameValue: string = '';
	export let disabled: boolean = false;
</script>

<button
	{type}
	class={`bg-blue-200 hover:bg-blue-300 active:bg-blue-500 w-full flex justify-center items-center py-2 h-12 shadow-md shadow-gray-500/80 disabled:bg-gray-500 disabled:cursor-not-allowed ${className}`}
	{disabled}
	on:click
>
	<slot />
	<span class={`font-bold ${classNameValue}`}>{value}</span>
</button>
