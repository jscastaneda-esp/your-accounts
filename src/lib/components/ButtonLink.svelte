<script lang="ts">
	export let text: string;
	export let href: string;
</script>

<a
	class="flex justify-center gap-2 relative text-gray-100 font-medium before:absolute before:-bottom-1 before:h-0.5 before:w-full before:origin-left before:scale-x-0 before:bg-black before:transition hover:before:scale-100 active:before:scale-100"
	{href}
>
	<slot />
	<span class="text-sm">{text}</span>
</a>
