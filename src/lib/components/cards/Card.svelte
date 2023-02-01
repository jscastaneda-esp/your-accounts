<script lang="ts">
	export let classNameContainer = '';
	export let showBody = false;
</script>

<article
	class={`bg-white w-full shadow-sm shadow-gray-400 rounded-lg transition-all ${classNameContainer}`}
>
	<header class="p-[11px]">
		<slot name="header" />
	</header>
	<main class="border-t-2 border-gray-300" class:hidden={!showBody}>
		<slot name="body" />
	</main>
</article>
