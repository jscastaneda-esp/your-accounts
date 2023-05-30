<script lang="ts">
	// Enums, Classes, Types
	import type { PageDataAuth } from '$lib/types'
	import { TypeAuthEnum } from '$lib/enums'

	import FormLogin from '$lib/components/FormLogin.svelte'
	import FormSignUp from '$lib/components/FormSignUp.svelte'

	export let data: PageDataAuth
</script>

<svelte:head>
	{#if TypeAuthEnum.LOGIN === data.type}
		<title>Iniciar Sesión</title>
	{:else}
		<title>Registrarse</title>
	{/if}
</svelte:head>

<div class="flex justify-center items-center">
	<div
		class="bg-blue-400 auth-container transition-all duration-200 ease-in-out"
		class:blur-content={TypeAuthEnum.SIGNUP === data.type}
		class:login={TypeAuthEnum.SIGNUP === data.type}
	>
		<FormLogin />
	</div>
	<div
		class="bg-white auth-container transition-all duration-200 ease-in-out"
		class:blur-content={TypeAuthEnum.LOGIN === data.type}
		class:signup={TypeAuthEnum.LOGIN === data.type}
	>
		<FormSignUp />
	</div>
</div>

<style lang="postcss">
	.blur-content {
		@apply max-w-[405px] max-h-[489px] blur-md pointer-events-none select-none -z-10 shadow-none hidden;
	}

	.blur-content.signup {
		@apply md:flex md:-ml-[112px];
	}

	.blur-content.login {
		@apply md:flex md:-mr-[112px];
	}
</style>
