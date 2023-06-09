<script lang="ts">
	// Svelte
	import { onMount } from 'svelte'
	import { goto } from '$app/navigation'

	// Components
	import Header from '$components/shared/Header.svelte'
	import ScreenLoading from '$components/shared/ScreenLoading.svelte'

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
	<Header />
	<slot />
{/if}
