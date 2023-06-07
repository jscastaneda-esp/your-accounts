<script lang="ts">
	import { onMount } from 'svelte'
	import { goto } from '$app/navigation'
	import { session } from '$lib/stores'
	import ScreenLoading from '$lib/components/ScreenLoading.svelte'

	onMount(() =>
		setTimeout(() => {
			if ($session) {
				goto('/dashboard')
			} else {
				goto('/login')
			}
		}, 1000)
	)
</script>

<ScreenLoading />
