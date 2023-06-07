<script lang="ts">
	// Svelte
	import { onMount } from 'svelte'
	import { goto } from '$app/navigation'
	import { PUBLIC_ENV } from '$env/static/public'

	// Assets
	import logo from '$lib/assets/images/logo.webp'
	import logoGoogle from '$lib/assets/images/logo-google.webp'

	// Enums, Classes, Types
	import { FirebaseProviderEnum } from '$lib/enums'
	import type { FirebaseError } from 'firebase/app'

	// Components
	import ButtonExternalAuth from '$lib/components/buttons/ButtonExternalAuth.svelte'
	import ScreenLoading from '$lib/components/ScreenLoading.svelte'

	// Utilities
	import firebase from '$lib/configs/firebase.client'
	import Toast from '$lib/utils/toast.utils'
	import { session } from '$lib/stores'
	import type { UserCredential } from 'firebase/auth'

	let loading = false
	let screenLoading = true

	onMount(() =>
		setTimeout(() => {
			if ($session) {
				goto('/dashboard')
			} else {
				screenLoading = false
			}
		}, 1000)
	)

	async function signInGoogle() {
		signIn(() => firebase.authFunctions.signInWithPopup(FirebaseProviderEnum.GOOGLE), {
			PROVIDER: FirebaseProviderEnum.GOOGLE
		})
	}

	async function signInTest() {
		signIn(() =>
			firebase.authFunctions.signInWithEmailAndPassword('test@jsc-developer.com', '12345678')
		)
	}

	async function signIn(cb: () => Promise<UserCredential>, tagsError?: Record<string, string>) {
		loading = true

		try {
			const userCredential = await cb()
			if (userCredential.user.email) {
				const response = await fetch('/login', {
					method: 'POST',
					body: JSON.stringify({
						uuid: userCredential.user.uid,
						email: userCredential.user.email
					})
				})
				if (response.status != 200) {
					firebase.authFunctions.signOut()
					Toast.error('Error inesperado. Por favor vuelva a intentarlo', true)
					return
				}
			}

			await goto('/dashboard')
		} catch (error: unknown) {
			const [msg, isError] = firebase.authFunctions.getError(
				(error as FirebaseError).code,
				tagsError
			)
			if (isError) {
				Toast.error(msg, true)
			} else {
				Toast.warn(msg, true)
			}
		} finally {
			loading = false
		}
	}
</script>

<svelte:head>
	<title>Iniciar Sesión</title>
</svelte:head>

{#if screenLoading}
	<ScreenLoading />
{:else}
	<div
		class="fixed inset-0 flex justify-center bg-blue-400 bg-[url('/background-image.webp')] bg-no-repeat bg-bottom"
	>
		<article class="flex flex-col justify-center">
			<section class="flex justify-center items-center gap-2 mb-[10px]">
				<img src={logo} alt="Logo" class="w-12 h-12" />
				<span class="text-center text-white text-xl leading-6">Ingresar a Tus Cuentas</span>
			</section>

			<section class="flex flex-col gap-3">
				<ButtonExternalAuth value="Google" on:click={signInGoogle} {loading}>
					<img src={logoGoogle} alt="Logo Google" />
				</ButtonExternalAuth>

				{#if PUBLIC_ENV != 'production'}
					<ButtonExternalAuth value="Pruebas" on:click={signInTest} {loading}>
						<i class="fas fa-code" />
					</ButtonExternalAuth>
				{/if}
			</section>
		</article>
	</div>
{/if}
