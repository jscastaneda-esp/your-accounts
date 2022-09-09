<script lang="ts">
	import Button from './Button.svelte';

	export let value: string;
	export let disabled: boolean = false;
</script>

<Button
	{value}
	className="!bg-gray-200 hover:!bg-gray-400 active:!bg-gray-500 active:!text-gray-200 disabled:!bg-gray-500"
	classNameValue="w-24"
	{disabled}
	on:click
>
	<slot />
</Button>
