<script lang="ts">
	// Svelte
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	// Utilities
	import firebase from '$lib/configs/firebase.client';
	import { session } from '$lib/stores/user.store';

	// Components
	import ScreenLoading from '$lib/components/ScreenLoading.svelte';

	let loading: boolean = true;

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
		} catch (error: any) {}
	}
</script>

{#if loading}
	<ScreenLoading />
{:else}
	<button type="button" on:click={signOut}>Cerrar sesión</button>
	<slot />
{/if}
