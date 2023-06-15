<script lang="ts">
	import { onMount } from 'svelte'
	import { goto } from '$app/navigation'
	import { screenLoading, session } from '$lib/stores/shared'

	screenLoading.show()

	onMount(() =>
		setTimeout(async () => {
			if ($session) {
				await goto('/budget')
			} else {
				await goto('/login')
			}
			screenLoading.hide()
		}, 1000)
	)
</script>
