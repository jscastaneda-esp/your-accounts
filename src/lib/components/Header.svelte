<script lang="ts">
	// Svelte
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	// Assets
	import logo from '../assets/images/logo.png';

	// Utilities
	import type { FirebaseError } from 'firebase/app';
	import firebase from '../configs/firebase.client';
	import Toast from '../utils/toast.utils';
	import { TypeAuthEnum } from '../enums/TypeAuth.enum';
	import { session } from '../stores/user.store';

	let showMenu = false;

	function toggleMenu() {
		showMenu = !showMenu;
	}

	async function signOut() {
		try {
			await firebase.authFunctions.signOut();
			goto('/auth/login');
		} catch (error) {
			const [msg, isError] = firebase.authFunctions.getError(
				TypeAuthEnum.SIGNOUT,
				(error as FirebaseError).code
			);
			if (isError) {
				Toast.error(msg);
			} else {
				Toast.warn(msg);
			}
		}
	}
</script>

<header
	class="z-20 w-full h-14 md:h-[66px] bg-blue-400 px-3 shadow shadow-gray-700 flex justify-between items-center"
>
	<section class="w-full md:w-max flex justify-between items-center gap-2">
		<a class="flex items-center gap-3" href="/dashboard">
			<img src={logo} alt="Logo" class="w-12 h-12" />
		</a>
		<span class="text-center text-black font-semibold text-2xl leading-6 tracking-wider"
			>Tus Cuentas</span
		>
		<button class="text-blue-200 text-2xl md:hidden" on:click={toggleMenu}>
			<i
				class="fa-solid transition-transform w-6"
				class:rotate-180={showMenu}
				class:fa-bars={!showMenu}
				class:text-black={!showMenu}
				class:fa-angles-right={showMenu}
			/>
		</button>
	</section>

	<nav class="hidden md:block">
		<ul id="menu" class="flex h-full items-center gap-1">
			<a href="/dashboard">
				<li class:active={$page.routeId === '(app)/dashboard'}>
					<i class="fa-solid fa-hand-holding-dollar" />
					<span>Proyectos</span>
				</li>
			</a>
			<!-- <a href="/reports">
				<li class:active={$page.routeId === '(app)/reports'}>
					<i class="fa-solid fa-chart-pie" />
					<span>Reportes</span>
				</li>
			</a> -->
		</ul>
	</nav>

	<div class="relative hidden md:flex flex-col items-center group">
		<button
			class="flex justify-between items-center gap-2 px-2 py-1 hover:bg-blue-200 rounded-lg transition-all duration-100"
			on:click={signOut}
		>
			<div class="flex flex-col text-left">
				<span class="text-lg font-bold">{$session?.displayName}</span>
				<span class="text-sm text-gray-600">{$session?.email}</span>
			</div>
			<i class="fa-solid fa-right-from-bracket text-lg" />
		</button>
		<div class="absolute top-full flex-col items-center hidden mb-6 group-hover:flex">
			<div class="w-3 h-3 rotate-45 bg-gray-600" />
			<span
				class="relative -mt-2 z-10 p-2 text-xs leading-none text-white whitespace-nowrap bg-gray-600 shadow-lg rounded-xl"
			>
				Cerrar sesión
			</span>
		</div>
	</div>
</header>

<div
	class="relative h-[calc(100%-3.5rem)] md:h-[calc(100%-66px)] overflow-y-auto"
	class:overflow-y-hidden={showMenu}
>
	<nav
		class="z-50 absolute w-full max-w-[320px] h-full bg-white pt-4 pr-5 flex flex-col justify-between shadow shadow-gray-700 transition-[margin] duration-300 md:hidden"
		class:ml-0={showMenu}
		class:-ml-[320px]={!showMenu}
	>
		<ul id="toggle">
			<a href="/dashboard">
				<li class:active={$page.routeId === '(app)/dashboard'}>
					<i class="fa-solid fa-hand-holding-dollar" />
					<span>Proyectos</span>
				</li>
			</a>
			<!-- <a href="/reports">
				<li class:active={$page.routeId === '(app)/reports'}>
					<i class="fa-solid fa-chart-pie" />
					<span>Reportes</span>
				</li>
			</a> -->
		</ul>

		<button
			class="flex flex-col justify-start px-4 py-1 text-left hover:bg-blue-200 rounded-tr-full transition-all duration-100"
			on:click={signOut}
		>
			<span class="text-lg font-bold">{$session?.displayName}</span>
			<span class="text-sm text-gray-500">{$session?.email}</span>
			<section class="text-sm">
				<i class="fa-solid fa-right-from-bracket" />
				&nbsp; Cerrar sesión
			</section>
		</button>
	</nav>

	<slot />
</div>

<style lang="postcss">
	#toggle li {
		@apply h-11 px-4 py-3 rounded-tr-full rounded-br-full hover:border-l-4 hover:border-blue-400 hover:bg-blue-200 hover:font-semibold transition-all duration-100;
	}

	#toggle li.active {
		@apply !border-l-8 border-blue-400 bg-blue-200 font-semibold;
	}

	#menu li {
		@apply h-11 px-4 py-3 rounded-t-lg hover:border-b-2 hover:border-blue-600 hover:bg-blue-200 hover:font-semibold hover:pb-4 hover:pt-2 transition-all duration-100;
	}

	#menu li.active {
		@apply !border-b-4 border-blue-600 bg-blue-200 font-semibold pb-4 pt-2;
	}
</style>
