<script lang="ts">
	import { SvelteToast, type SvelteToastOptions } from '@zerodevx/svelte-toast';

	import '../app.css';
	import firebase from '$lib/configs/firebase.client';
	import { session } from '$lib/stores';
	import { Settings } from 'luxon';

	firebase.authFunctions.onAuthStateChanged((user) => {
		$session = user;
	});

	const toastOptions: SvelteToastOptions = { pauseable: true, reversed: true, intro: { y: 192 } };

	Settings.defaultLocale = 'es-CO';
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
