<script lang="ts">
	// Svelte
	import { version } from '$app/environment'
	import { PUBLIC_ENV } from '$env/static/public'
	import type { PageData } from './$types'

	// Components
	import ButtonBlock from '$components/shared/buttons/ButtonBlock.svelte'

	// Utilities
	import { signIn } from '@auth/sveltekit/client'
	import Toast from '$utils/toast.utils'
	import { onMount } from 'svelte'

	export let data: PageData

	onMount(() => {
		if (data.error) {
			setTimeout(() => {
				Toast.error('Se presento un error al iniciar sesión', true)
			}, 500)
		}
	})
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
			<ButtonBlock value="Google" on:click={() => signIn('google')}>
				<i class="bx bxl-google" />
			</ButtonBlock>

			{#if PUBLIC_ENV != 'production'}
				<ButtonBlock
					value="Pruebas"
					on:click={() =>
						signIn('credentials', { username: 'test@jsc-developer.com', password: 'P4s5W0rd*' })}
				>
					<i class="fas fa-code" />
				</ButtonBlock>
			{/if}
		</section>
	</article>
</main>
