<script lang="ts">
	// Svelte
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	// Utilities
	import firebase from '$lib/configs/firebase.client';
	import { session } from '$lib/stores/user.store';
	import Toast from '$lib/utils/toast.utils';
	import type { FirebaseError } from 'firebase/app';

	// Components
	import ScreenLoading from '$lib/components/ScreenLoading.svelte';

	let loading = true;

	onMount(() =>
		setTimeout(() => {
			if (!$session) {
				goto('/auth/login');
			} else {
				loading = false;
			}
		}, 1000)
	);

	async function signOut() {
		try {
			await firebase.authFunctions.signOut();
			goto('/auth/login');
		} catch (error) {
			const [msg, isError] = firebase.authFunctions.getError((error as FirebaseError).code);
			if (isError) {
				Toast.error(msg);
			} else {
				Toast.warn(msg);
			}
		}
	}
</script>

{#if loading}
	<ScreenLoading />
{:else}
	<button type="button" on:click={signOut}>Cerrar sesión</button>
	<slot />
{/if}
