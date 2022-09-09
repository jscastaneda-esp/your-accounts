<script lang="ts">
	import { SvelteToast, type SvelteToastOptions } from '@zerodevx/svelte-toast';

	import '../app.css';
	import firebase from '$lib/configs/firebase.client';
	import { session } from '$lib/stores/user.store';

	firebase.authFunctions.onAuthStateChanged((user) => {
		$session = user;
	});

	const toastOptions: SvelteToastOptions = { pausable: true, reversed: true, intro: { y: 192 } };
</script>

<main class="container m-auto">
	<slot />
</main>

<SvelteToast options={toastOptions} />

<style>
	:root {
		--toastContainerTop: auto;
		--toastContainerRight: auto;
		--toastContainerBottom: 1rem;
		--toastContainerLeft: calc(50vw - 8rem);
		--toastPadding: 0;
		--toastMsgPadding: 0;
		--toastMinHeight: auto;
		--toastColor: #4b5563;
	}
</style>
