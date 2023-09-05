<script lang="ts">
	import '../app.css'
	import 'boxicons/css/boxicons.min.css'
	import { Toaster } from 'svelte-sonner'
	import firebaseService from '$services/firebase.service'
	import { session } from '$lib/stores/shared'
	import ScreenLoading from '$components/shared/ScreenLoading.svelte'
	import ConfirmPopup from '$components/shared/popup/ConfirmPopup.svelte'

	firebaseService.authFunctions.onAuthStateChanged((user) => {
		session.set(user)
	})
</script>

<slot />

<ScreenLoading />
<ConfirmPopup />
<Toaster position="bottom-center" theme="dark" visibleToasts={5} closeButton />
