<script lang="ts">
	// Enums, Types, Utilities
	import { page } from '$app/stores'

	// Components
	import Navbar from '$components/shared/navbar/Navbar.svelte'
	import NavbarItem from '$components/shared/navbar/NavbarItem.svelte'
	import type { Budget } from '$lib/types'

	export let data: Budget
</script>

<section class="py-2">
	<Navbar>
		<NavbarItem
			href={`/budget/${data.id}/details`}
			active={$page.route.id === '/(app)/budget/[id]/details'}
			text="Disponible"
		>
			<i class="bx bxs-wallet-alt" />
		</NavbarItem>
		<NavbarItem
			href={`/budget/${data.id}/details/payments`}
			active={$page.route.id === '/(app)/budget/[id]/details/payments'}
			text="Pagos"
		>
			<i class="bx bxs-file" />
		</NavbarItem>
	</Navbar>

	<div class="divider -mt-1 -mb-1" />

	<slot />
</section>
