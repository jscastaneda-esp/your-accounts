<script lang="ts">
	// Svelte
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	// Utilities
	import { session } from '$lib/stores';

	// Components
	import ScreenLoading from '$lib/components/ScreenLoading.svelte';
	import Header from '$lib/components/Header.svelte';

	let loading = true;

	onMount(() =>
		setTimeout(() => {
			if (!$session) {
				goto('/auth/login');
			} else {
				loading = false;
			}
		}, 1000)
	);
</script>

{#if loading}
	<ScreenLoading />
{:else}
	<Header>
		<slot />
	</Header>
{/if}
