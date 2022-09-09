<script lang="ts">
	// Svelte
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	// Utilities
	import { session } from '$lib/stores/user.store';

	// Components
	import ScreenLoading from '$lib/components/ScreenLoading.svelte';

	let loading: boolean = true;

	onMount(() =>
		setTimeout(() => {
			if ($session) {
				goto('/dashboard');
			} else {
				loading = false;
			}
		}, 1000)
	);
</script>

{#if loading}
	<ScreenLoading />
{:else}
	<div class="flex justify-center items-center">
		<slot />
	</div>
{/if}
