<script lang="ts">
	// Svelte
	import { onMount } from 'svelte'
	import { goto } from '$app/navigation'

	// Components
	import HeaderPage from '$lib/components/HeaderPage.svelte'
	import ScreenLoading from '$lib/components/ScreenLoading.svelte'

	// Utilities
	import { session } from '$lib/stores'

	let screenLoading = true

	onMount(() =>
		setTimeout(() => {
			if (!$session) {
				goto('/login')
			} else {
				screenLoading = false
			}
		}, 1000)
	)
</script>

{#if screenLoading}
	<ScreenLoading />
{:else}
	<HeaderPage />
	<main class="min-h-full">
		<slot />
	</main>
{/if}
