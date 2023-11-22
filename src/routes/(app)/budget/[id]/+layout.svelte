<script lang="ts">
	// Enums, Types, Utilities
	import { onDestroy, onMount, setContext } from 'svelte'
	import { beforeNavigate, goto } from '$app/navigation'
	import { page } from '$app/stores'
	import { confirmPopup } from '$lib/stores/shared'
	import { changesStore } from '$lib/stores/changes'
	import { availablesStore, billsDataStore, dataStore, resumeStore } from '$lib/stores/budget'
	import { ContextNameEnum } from '$lib/enums'
	import Toast from '$utils/toast.utils'
	import { zeroPad } from '$utils/number.utils'
	import BudgetService from '$services/budget/budget.service'
	import type { Budget } from '$lib/types'
	import type { BeforeNavigate } from '@sveltejs/kit'

	// Components
	import Tabs from '$components/shared/tabs/Tabs.svelte'
	import TabItem from '$components/shared/tabs/TabItem.svelte'
	import ButtonLink from '$components/shared/buttons/ButtonLink.svelte'

	export let data: Budget

	const changes = changesStore()
	const { dataS } = dataStore(data)
	const { month } = resumeStore(`${data.year}-${zeroPad(data.month, 2)}`)
	const { totalAvailable } = availablesStore(
		data.availables.reduce((previous, current) => previous + current.amount, 0)
	)
	const { bills, totals, statistics } = billsDataStore(data.bills)
	const service = new BudgetService($page, changes)

	let interval: ReturnType<typeof setInterval>
	let confirmExit = false

	onMount(() => {
		interval = setInterval(() => handleSave(), 15000)
	})

	onDestroy(exit)

	beforeNavigate(async ({ to, cancel }: BeforeNavigate) => {
		if (
			!to?.route.id?.startsWith('/login') &&
			!to?.url.pathname.startsWith(`/budget/${data.id}`) &&
			$changes.length &&
			!confirmExit
		) {
			cancel()

			if (to) {
				confirmExit = await new Promise<boolean>((resolve) => {
					confirmPopup.show(
						'¿Realmente desea salir?',
						'Al salir se pueden perder cambios. Se recomienda primero guardar',
						() => resolve(true),
						() => resolve(false)
					)
				})

				if (confirmExit) {
					exit()
					goto(to.url)
				}
			}
		}
	})

	setContext(ContextNameEnum.CHANGES, { changes })
	setContext(ContextNameEnum.BUDGET_MAIN, { data: dataS })
	setContext(ContextNameEnum.BUDGET_RESUME, { month })
	setContext(ContextNameEnum.BUDGET_AVAILABLES, { totalAvailable })
	setContext(ContextNameEnum.BUDGET_BILLS, { bills, totals, statistics })

	async function handleSave() {
		service.save(data.id, [...$changes], () =>
			Toast.error('Se presento un error al guardar la información del presupuesto')
		)
	}

	function beforeUnload(event: BeforeUnloadEvent) {
		if ($changes.length) {
			event.preventDefault()
			return (event.returnValue = '')
		}
	}

	function exit() {
		changes.clear()

		if (interval) {
			clearInterval(interval)
		}
	}
</script>

<svelte:head>
	<title>Presupuesto | Tus Cuentas</title>
</svelte:head>

<svelte:window on:beforeunload={beforeUnload} on:pagehide={exit} />

<section class="flex justify-between">
	<ButtonLink value="Guardar" disabled={$changes.length == 0} on:click={handleSave}>
		<i class="bx bxs-save" />
	</ButtonLink>
	<ButtonLink value="Salir" on:click={() => goto('/budget')}>
		<i class="bx bx-arrow-back" />
	</ButtonLink>
</section>

<section class="p-2 pt-0">
	<Tabs>
		<TabItem
			href={`/budget/${data.id}`}
			active={$page.route.id === '/(app)/budget/[id]'}
			text="Resumen"
		>
			<i class="bx bxs-detail" />
		</TabItem>
		<TabItem
			href={`/budget/${data.id}/details`}
			active={$page.route.id?.includes('/(app)/budget/[id]/details') || false}
			text="Detalle"
		>
			<i class="bx bxs-dollar-circle" />
		</TabItem>
		<TabItem
			href={`/budget/${data.id}/statistics`}
			active={$page.route.id === '/(app)/budget/[id]/statistics'}
			text="Estadísticas"
		>
			<i class="bx bxs-bar-chart-alt-2" />
		</TabItem>
	</Tabs>

	<slot />
</section>
