<script lang="ts">
	// Svelte
	import { onMount } from 'svelte'
	import { goto } from '$app/navigation'
	import { PUBLIC_ENV } from '$env/static/public'

	// Components
	import ButtonBlock from '$components/shared/buttons/ButtonBlock.svelte'

	// Utilities
	import Toast from '$utils/toast.utils'
	import { screenLoading, session } from '$lib/stores/shared'
	import LoginService from '$services/login.service'
	import { trytm } from '@bdsqqq/try'

	const service = new LoginService()

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

	async function signIn(type: 'google' | 'test') {
		loading = true

		if (type === 'google') {
			await trytm(service.signInGoogle(successCB, errCb))
		} else {
			await trytm(service.signInTest(successCB, errCb))
		}

		loading = false
	}

	async function successCB() {
		await goto('/budget')
	}

	function errCb(msg: string, isError: boolean) {
		if (isError) {
			Toast.error(msg, true)
		} else {
			Toast.warn(msg, true)
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
				<ButtonBlock value="Google" on:click={() => signIn('google')} {loading}>
					<i class="bx bxl-google" />
				</ButtonBlock>

				{#if PUBLIC_ENV != 'production'}
					<ButtonBlock value="Pruebas" on:click={() => signIn('test')} {loading}>
						<i class="fas fa-code" />
					</ButtonBlock>
				{/if}
			</section>
		</article>
	</main>
{/if}
