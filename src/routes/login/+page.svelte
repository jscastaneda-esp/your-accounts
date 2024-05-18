<script lang="ts">
	// Svelte
	import { version } from '$app/environment'
	import { PUBLIC_ENV } from '$env/static/public'
	import type { PageData } from './$types'

	// Utilities
	import { signIn, type SignInOptions } from '@auth/sveltekit/client'
	import Toast from '$utils/toast.utils'
	import { onMount } from 'svelte'
	import Button from '$components/shared/buttons/Button.svelte'
	import Icon from '$components/shared/Icon.svelte'
	import { trytm } from '@bdsqqq/try'
	import Footer from '$components/shared/Footer.svelte'

	export let data: PageData

	let loading = false

	onMount(() => {
		if (data.error) {
			setTimeout(() => {
				Toast.error('Se presento un error al iniciar sesión', true)
			}, 500)
		}
	})

	async function onSignIn(provider: 'google' | 'credentials') {
		loading = true

		const options: SignInOptions = {}
		if (provider === 'credentials') {
			options.username = 'test@jsc-developer.com'
			options.password = 'P4s5W0rd*'
		}

		await trytm(signIn(provider, options))
		loading = false
	}
</script>

<svelte:head>
	<title>Iniciar Sesión</title>
</svelte:head>

<main
	class="fixed inset-0 flex justify-center bg-neutral bg-[url('/background-image.webp')] bg-no-repeat bg-bottom"
>
	<article class="flex flex-col justify-center">
		<article class="indicator">
			<section class="flex justify-center items-center gap-2 mb-[15px]">
				<img src="/logo.svg" alt="Logo" class="w-10 h-10" />
				<span class="text-center text-xl leading-6">Ingresar a Tus Cuentas</span>
			</section>
			<span class="indicator-item indicator-top badge badge-primary">v{version}</span>
		</article>

		<section class="flex flex-col gap-3">
			<Button
				value="Google"
				className="btn-primary"
				block
				{loading}
				on:click={() => onSignIn('google')}
			>
				<Icon>
					<path
						d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z"
					/>
				</Icon>
			</Button>

			{#if PUBLIC_ENV != 'production'}
				<Button
					value="Pruebas"
					className="btn-primary"
					block
					{loading}
					on:click={() => onSignIn('credentials')}
				>
					<Icon>
						<path
							d="M5.59 3.41L7 4.82L3.82 8L7 11.18L5.59 12.6L1 8L5.59 3.41M11.41 3.41L16 8L11.41 12.6L10 11.18L13.18 8L10 4.82L11.41 3.41M22 6V18C22 19.11 21.11 20 20 20H4C2.9 20 2 19.11 2 18V14H4V18H20V6H17.03V4H20C21.11 4 22 4.89 22 6Z"
						/>
					</Icon>
				</Button>
			{/if}
		</section>
	</article>
</main>

<Footer />
