<script lang="ts">
	// Enums, Classes, Types
	import type { PageDataAuth } from '$lib/types/PageDataAuth';
	import { TypeAuthEnum } from '$lib/enums/TypeAuth.enum';

	import Login from '$lib/components/Login.svelte';
	import SignUp from '$lib/components/SignUp.svelte';

	export let data: PageDataAuth;
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
		class="bg-blue-400"
		class:blur-content={TypeAuthEnum.SIGNUP === data.type}
		class:login={TypeAuthEnum.SIGNUP === data.type}
	>
		<Login />
	</div>
	<div
		class="bg-white"
		class:blur-content={TypeAuthEnum.LOGIN === data.type}
		class:signup={TypeAuthEnum.LOGIN === data.type}
	>
		<SignUp />
	</div>
</div>

<style lang="postcss">
	div > div {
		@apply auth-container transition-all duration-200 ease-in-out;
	}

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
