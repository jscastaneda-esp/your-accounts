<script>
	import { page } from '$app/stores';

	import notFound from '$lib/assets/images/not-found.svg';
	import error from '$lib/assets/images/error.svg';
</script>

<svelte:head>
	<title>{$page.status} Error!</title>
</svelte:head>

<div class="h-full w-full flex flex-col justify-center items-center bg-blue-400">
	{#if $page.status === 404}
		<img src={notFound} alt="Not Found" class="h-1/2" />
		<h1>Hmmm!</h1>
		<span>No encontramos lo que buscabas</span>
	{:else}
		<img src={error} alt="Error" class="h-1/3" />
		<h1>Ops!</h1>
		<span>Estamos trabajando en la solución</span>
	{/if}
</div>

<style lang="postcss">
	div > h1 {
		@apply text-5xl font-bold mb-2;
	}
</style>
