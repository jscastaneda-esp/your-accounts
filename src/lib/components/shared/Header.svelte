<script lang="ts">
	// Svelte
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'

	// Utilities
	import type { FirebaseError } from 'firebase/app'
	import firebase from '$lib/configs/firebase.client'
	import Toast from '$utils/toast.utils'
	import { session } from '$lib/stores'

	async function signOut() {
		try {
			await firebase.authFunctions.signOut()
			await fetch('/login', {
				method: 'DELETE'
			})
			goto('/login')
		} catch (error) {
			const [msg, isError] = firebase.authFunctions.getError((error as FirebaseError).code)
			if (isError) {
				Toast.error(msg)
			} else {
				Toast.warn(msg)
			}
		}
	}
</script>

<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<!-- svelte-ignore a11y-label-has-associated-control -->
<header class="sticky top-0 z-50">
	<nav class="navbar bg-primary-focus text-primary-content">
		<div class="navbar-start">
			<div class="dropdown">
				<label tabindex="0" class="btn btn-ghost lg:hidden text-xl">
					<i class="bx bx-menu" />
				</label>
				<ul
					tabindex="0"
					class="menu menu-sm dropdown-content mt-3 p-2 shadow bg-primary-focus rounded-b-box rounded-tr-box w-52"
				>
					<li>
						<a href="/budget" class:active={$page.route.id === '/(app)/budget'}>
							<i class="bx bxs-spreadsheet" />
							<span>Presupuestos</span>
						</a>
					</li>
				</ul>
			</div>
			<a class="btn btn-ghost normal-case text-xl align-middle" href="/">
				<i class="bx bxs-wallet" />
				Tus Cuentas
			</a>
		</div>
		<div class="navbar-center hidden lg:flex">
			<ul class="menu menu-horizontal px-1">
				<li>
					<a href="/budget" class:active={$page.route.id === '/(app)/budget'}>
						<i class="bx bxs-spreadsheet" />
						<span>Presupuestos</span>
					</a>
				</li>
			</ul>
		</div>
		<div class="navbar-end">
			<div class="dropdown dropdown-end">
				<label tabindex="0" class="btn btn-ghost btn-circle avatar">
					<div class="w-10 rounded-full">
						<!-- svelte-ignore a11y-img-redundant-alt -->
						<img
							src={$session?.photoURL || 'http://www.gravatar.com/avatar/?d=mp'}
							alt="Profile Photo"
						/>
					</div>
				</label>
				<ul
					tabindex="0"
					class="mt-3 p-2 shadow menu menu-sm dropdown-content bg-primary-focus rounded-b-box rounded-tl-box w-60"
				>
					<li class="menu-title !text-base-100 bg-primary rounded-tl-box rounded-br-box">
						<span>{$session?.displayName || 'Pruebas'}</span>
						<span class="opacity-70">{$session?.email}</span>
					</li>
					<li><button on:click={signOut}>Cerrar sesión</button></li>
				</ul>
			</div>
		</div>
	</nav>
</header>
