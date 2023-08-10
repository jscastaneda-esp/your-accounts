<script lang="ts">
	// Enums, Types, Utilities
	import { page } from '$app/stores'

	// Components
	import Tabs from '$components/shared/tabs/Tabs.svelte'
	import TabItem from '$components/shared/tabs/TabItem.svelte'
	import type { Budget } from '$lib/types'

	export let data: Budget
</script>

<section>
	<Tabs className="rounded-none">
		<TabItem
			href={`/budget/${data.id}/details`}
			active={$page.route.id === '/(app)/budget/[id]/details'}
			text="Disponibles"
		>
			<i class="bx bxs-wallet-alt" />
		</TabItem>
		<TabItem
			href={`/budget/${data.id}/details/payments`}
			active={$page.route.id === '/(app)/budget/[id]/details/payments'}
			text="Pagos"
		>
			<i class="bx bxs-file" />
		</TabItem>
	</Tabs>

	<slot />
</section>
