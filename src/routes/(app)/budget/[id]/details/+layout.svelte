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
			text="Pagos"
		>
			<i class="bx bxs-file" />
		</TabItem>
		<TabItem
			href={`/budget/${data.id}/details/availables`}
			active={$page.route.id === '/(app)/budget/[id]/details/availables'}
			text="Disponibles"
		>
			<i class="bx bxs-wallet" />
		</TabItem>
	</Tabs>

	<slot />
</section>
