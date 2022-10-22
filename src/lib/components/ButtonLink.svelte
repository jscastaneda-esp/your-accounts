<script lang="ts">
	export let text: string;
	export let href = '#';
	export let className = '';
	export let disabled = false;
</script>

<a
	class={`flex justify-center items-center gap-2 relative text-gray-700 text-sm font-medium before:absolute before:-bottom-1 before:h-0.5 before:w-full before:origin-left before:scale-x-0 before:bg-black before:transition hover:before:scale-100 active:before:scale-100 ${className}`}
	{href}
	class:pointer-events-none={disabled}
	on:click
>
	<slot />
	<span>{text}</span>
</a>
