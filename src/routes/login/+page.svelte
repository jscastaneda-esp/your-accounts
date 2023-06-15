<script lang="ts">
	// Svelte
	import { onMount } from 'svelte'
	import { goto } from '$app/navigation'
	import { PUBLIC_ENV } from '$env/static/public'

	// Enums, Classes, Types
	import { FirebaseProviderEnum } from '$lib/enums'
	import type { FirebaseError } from 'firebase/app'

	// Components
	import ButtonBlock from '$components/shared/buttons/ButtonBlock.svelte'

	// Utilities
	import firebase from '$lib/configs/firebase.client'
	import Toast from '$utils/toast.utils'
	import { screenLoading, session } from '$lib/stores/shared'
	import type { UserCredential } from 'firebase/auth'

	let loading = false

	screenLoading.show()
	Toast.clear()

	onMount(() =>
		setTimeout(async () => {
			if ($session) {
				await goto('/budget')
			}
			screenLoading.hide()
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

			await goto('/budget')
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

{#if !$screenLoading}
	<main
		class="fixed inset-0 flex justify-center bg-neutral bg-[url('/background-image.webp')] bg-no-repeat bg-bottom"
	>
		<article class="flex flex-col justify-center">
			<section class="flex justify-center items-center gap-2 mb-[15px]">
				<img src="/logo.svg" alt="Logo" class="w-10 h-10" />
				<span class="text-center text-xl leading-6">Ingresar a Tus Cuentas</span>
			</section>

			<section class="flex flex-col gap-3">
				<ButtonBlock value="Google" on:click={signInGoogle} {loading}>
					<i class="bx bxl-google" />
				</ButtonBlock>

				{#if PUBLIC_ENV != 'production'}
					<ButtonBlock value="Pruebas" on:click={signInTest} {loading}>
						<i class="fas fa-code" />
					</ButtonBlock>
				{/if}
			</section>
		</article>
	</main>
{/if}
