<script lang="ts">
	// Svelte
	import { onMount } from 'svelte'
	import { goto } from '$app/navigation'

	// Components
	import Header from '$components/shared/Header.svelte'

	// Utilities
	import { screenLoading, session } from '$lib/stores/shared'
	import Toast from '$utils/toast.utils'

	screenLoading.show()
	Toast.clear()

	onMount(() =>
		setTimeout(() => {
			if (!$session) {
				goto('/login')
			}
			screenLoading.hide()
		}, 1000)
	)
</script>

<Header />
<slot />
