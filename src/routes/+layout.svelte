<script lang="ts">
	import '../app.css'
	import 'boxicons/css/boxicons.min.css'
	import { SvelteToast } from '@zerodevx/svelte-toast'
	import firebase from '$lib/configs/firebase.client'
	import { session } from '$lib/stores'
	import type { SvelteToastOptions } from '@zerodevx/svelte-toast/stores'

	firebase.authFunctions.onAuthStateChanged((user) => {
		$session = user
	})

	const toastOptions: SvelteToastOptions = { pausable: true, reversed: true, intro: { y: 192 } }
</script>

<slot />

<SvelteToast options={toastOptions} />
