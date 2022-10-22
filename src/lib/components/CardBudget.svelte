<script lang="ts">
	export let classNameContainer = '';
	export let showBody = false;
</script>

<article class={`bg-white w-full shadow-sm shadow-gray-400 rounded-lg ${classNameContainer}`}>
	<header class="p-[11px]">
		<slot name="header" />
	</header>
	{#if $$slots.body && showBody}
		<main class="border-t-2 border-gray-300">
			<slot name="body" />
		</main>
	{/if}
</article>
