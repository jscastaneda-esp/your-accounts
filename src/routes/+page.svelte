<script lang="ts">
	import { goto } from '$app/navigation'
	import { screenLoading, session } from '$lib/stores/shared'
	import { onMount } from 'svelte'

	screenLoading.show()

	onMount(() =>
		setTimeout(() => {
			if ($session) {
				goto('/budget')
			} else {
				goto('/login')
			}
			screenLoading.hide()
		}, 1000)
	)
</script>
