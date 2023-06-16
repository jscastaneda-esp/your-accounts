<script lang="ts">
	import '../app.css'
	import 'boxicons/css/boxicons.min.css'
	import { SvelteToast } from '@zerodevx/svelte-toast'
	import firebase from '$lib/configs/firebase.client'
	import { session } from '$lib/stores/shared'
	import type { SvelteToastOptions } from '@zerodevx/svelte-toast/stores'
	import ScreenLoading from '$components/shared/ScreenLoading.svelte'
	import ConfirmPopup from '$components/shared/popup/ConfirmPopup.svelte'

	firebase.authFunctions.onAuthStateChanged((user) => {
		session.set(user)
	})

	const toastOptions: SvelteToastOptions = { pausable: true, reversed: true, intro: { y: 192 } }
</script>

<slot />

<ScreenLoading />
<ConfirmPopup />
<SvelteToast options={toastOptions} />
