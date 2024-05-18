<script lang="ts">
	import { page } from '$app/stores'
	import Tabs from '$components/shared/tabs/Tabs.svelte'
	import TabItem from '$components/shared/tabs/TabItem.svelte'
	import Icon from '$components/shared/Icon.svelte'
	import type { Budget } from '$lib/types'

	export let data: Budget
</script>

<section>
	<Tabs>
		<TabItem
			href={`/budget/${data.id}/details`}
			text="Pagos"
			active={$page.route.id === '/(app)/budget/[id]/details'}
		>
			<Icon>
				<path
					d="M21,19V17H8V19H21M21,13V11H8V13H21M8,7H21V5H8V7M4,5V7H6V5H4M3,5A1,1 0 0,1 4,4H6A1,1 0 0,1 7,5V7A1,1 0 0,1 6,8H4A1,1 0 0,1 3,7V5M4,11V13H6V11H4M3,11A1,1 0 0,1 4,10H6A1,1 0 0,1 7,11V13A1,1 0 0,1 6,14H4A1,1 0 0,1 3,13V11M4,17V19H6V17H4M3,17A1,1 0 0,1 4,16H6A1,1 0 0,1 7,17V19A1,1 0 0,1 6,20H4A1,1 0 0,1 3,19V17Z"
				/>
			</Icon>
		</TabItem>
		<TabItem
			href={`/budget/${data.id}/details/availables`}
			text="Disponibles"
			active={$page.route.id === '/(app)/budget/[id]/details/availables'}
		>
			<Icon>
				<path
					d="M21,18V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5A2,2 0 0,1 5,3H19A2,2 0 0,1 21,5V6H12C10.89,6 10,6.9 10,8V16A2,2 0 0,0 12,18M12,16H22V8H12M16,13.5A1.5,1.5 0 0,1 14.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,12A1.5,1.5 0 0,1 16,13.5Z"
				/>
			</Icon>
		</TabItem>
	</Tabs>

	<slot />
</section>
