<script lang="ts">
	// Svelte
	import { page } from '$app/stores'
	import { version } from '$app/environment'

	// Utilities
	import { signOut } from '@auth/sveltekit/client'
	import Icon from './Icon.svelte'
	import Tooltip from './Tooltip.svelte'
</script>

<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<!-- svelte-ignore a11y-label-has-associated-control -->
<header class="sticky top-0 z-50">
	<nav class="navbar bg-primary text-primary-content">
		<section class="navbar-start py-1">
			<article class="dropdown lg:hidden">
				<label tabindex="0" class="btn btn-ghost text-xl">
					<Icon className="!h-6 !w-6">
						<path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" />
					</Icon>
				</label>
				<ul
					tabindex="0"
					class="menu menu-sm dropdown-content mt-3 p-2 shadow bg-primary rounded-b-box rounded-tr-box w-52"
				>
					<li>
						<a href="/budget" class:active={$page.route.id?.includes('/(app)/budget') || false}>
							<Icon>
								<path
									d="M7 2H21C22.11 2 23 2.9 23 4V16C23 17.11 22.11 18 21 18H7C5.9 18 5 17.11 5 16V4C5 2.9 5.9 2 7 2M7 6V10H13V6H7M15 6V10H21V6H15M7 12V16H13V12H7M15 12V16H21V12H15M3 20V6H1V20C1 21.11 1.89 22 3 22H19V20H3Z"
								/>
							</Icon>
							<span>Presupuestos</span>
						</a>
					</li>
				</ul>
			</article>
			<article class="indicator">
				<a class="btn btn-ghost normal-case text-xl align-middle" href="/">
					<Icon className="!h-6 !w-6">
						<path
							d="M17 3H7C4.79 3 3 4.79 3 7V17C3 19.21 4.79 21 7 21H19C20.11 21 21 20.11 21 19V9C21 7.9 20.11 7 19 7V5C19 3.9 18.11 3 17 3M17 5V7H7C6.27 7 5.59 7.2 5 7.54V7C5 5.9 5.9 5 7 5M15.5 15.5C14.67 15.5 14 14.83 14 14S14.67 12.5 15.5 12.5 17 13.17 17 14 16.33 15.5 15.5 15.5Z"
						/>
					</Icon>
					<span class="hidden md:block"> Tus Cuentas </span>
				</a>
				<span class="indicator-item indicator-bottom badge badge-neutral">v{version}</span>
			</article>
		</section>
		<section class="navbar-center hidden lg:flex">
			<ul class="menu menu-horizontal px-1">
				<li>
					<a href="/budget" class:active={$page.route.id?.includes('/(app)/budget') || false}>
						<Icon>
							<path
								d="M7 2H21C22.11 2 23 2.9 23 4V16C23 17.11 22.11 18 21 18H7C5.9 18 5 17.11 5 16V4C5 2.9 5.9 2 7 2M7 6V10H13V6H7M15 6V10H21V6H15M7 12V16H13V12H7M15 12V16H21V12H15M3 20V6H1V20C1 21.11 1.89 22 3 22H19V20H3Z"
							/>
						</Icon>
						<span>Presupuestos</span>
					</a>
				</li>
			</ul>
		</section>
		<section class="navbar-end">
			<Tooltip text="GitHub" direction="bottom" className="tooltip-secondary">
				<a
					class="btn btn-ghost btn-circle"
					href="https://github.com/jscastaneda-esp/your-accounts"
					target="_blank"
				>
					<Icon className="!h-6 !w-6">
						<path
							d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"
						/>
					</Icon>
				</a>
			</Tooltip>

			<Tooltip text="Informar error/mejora" direction="bottom" className="tooltip-secondary">
				<a
					class="btn btn-ghost btn-circle"
					href="https://github.com/jscastaneda-esp/your-accounts/issues"
					target="_blank"
				>
					<Icon className="!h-6 !w-6">
						<path
							d="M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z"
						/>
					</Icon>
				</a>
			</Tooltip>

			<article class="dropdown dropdown-end">
				<label tabindex="0" class="btn btn-ghost btn-circle avatar">
					<div class="w-10 rounded-full">
						<!-- svelte-ignore a11y-img-redundant-alt -->
						<img src={$page.data.session?.user?.image} alt="Profile Photo" />
					</div>
				</label>
				<ul
					tabindex="0"
					class="mt-3 p-2 shadow menu menu-sm dropdown-content bg-primary rounded-b-box rounded-tl-box w-60"
				>
					<div class="menu-title !text-base-100 bg-primary rounded-tl-box rounded-br-box">
						<p>{$page.data.session?.user?.name || 'Pruebas'}</p>
						<p class="opacity-70">{$page.data.session?.user?.email}</p>
					</div>
					<li>
						<button on:click={() => signOut()}>
							<Icon
								><path
									d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.58L17 17L22 12M4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z"
								/>
							</Icon>
							Cerrar sesión
						</button>
					</li>
				</ul>
			</article>
		</section>
	</nav>
</header>
