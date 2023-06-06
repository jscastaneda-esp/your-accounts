<script lang="ts">
	// Svelte
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import { PUBLIC_ENV } from '$env/static/public'

	// Assets
	import logo from '$lib/assets/images/logo.webp'
	import logoGoogle from '$lib/assets/images/logo-google.webp'

	// Enums, Classes, Types
	import { FirebaseProviderEnum } from '$lib/enums'
	import type { FirebaseError } from 'firebase/app'

	// Components
	import ButtonExternalAuth from '$lib/components/buttons/ButtonExternalAuth.svelte'

	// Utilities
	import firebase from '$lib/configs/firebase.client'
	import Toast from '$lib/utils/toast.utils'
	import { trpc } from '$lib/trpc/client'
	import { sessionToken } from '$lib/stores'

	const trpcF = trpc($page)

	let loading = false

	async function signInGoogle() {
		loading = true

		try {
			const userCredential = await firebase.authFunctions.signInWithPopup(
				FirebaseProviderEnum.GOOGLE
			)
			if (userCredential.user.email) {
				$sessionToken = await trpcF.users.auth.mutate({
					uuid: userCredential.user.uid,
					email: userCredential.user.email
				})
			}

			await goto('/dashboard')
		} catch (error: unknown) {
			const [msg, isError] = firebase.authFunctions.getError((error as FirebaseError).code, {
				PROVIDER: FirebaseProviderEnum.GOOGLE
			})
			if (isError) {
				Toast.error(msg, true)
			} else {
				Toast.warn(msg, true)
			}
		} finally {
			loading = false
		}
	}

	async function signInTest() {
		loading = true

		try {
			const userCredential = await firebase.authFunctions.signInWithEmailAndPassword(
				'test@jsc-developer.com',
				'12345678'
			)
			if (userCredential.user.email) {
				$sessionToken = await trpcF.users.auth.mutate({
					uuid: userCredential.user.uid,
					email: userCredential.user.email
				})
			}

			await goto('/dashboard')
		} catch (error: unknown) {
			const [msg, isError] = firebase.authFunctions.getError((error as FirebaseError).code, {
				PROVIDER: FirebaseProviderEnum.GOOGLE
			})
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
