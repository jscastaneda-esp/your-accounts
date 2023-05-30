<script lang="ts">
	import '@fortawesome/fontawesome-free/css/all.min.css'
	import '../app.css'
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

<style>
	:root {
		--toastContainerTop: 5rem;
		--toastPadding: 0;
		--toastMsgPadding: 0;
		--toastMinHeight: auto;
		--toastColor: #4b5563;
	}

	@media (max-width: 768px) {
		:root {
			--toastContainerTop: auto;
			--toastContainerBottom: 2.5rem;
			--toastContainerLeft: calc(50vw - 8rem);
		}
	}
</style>
