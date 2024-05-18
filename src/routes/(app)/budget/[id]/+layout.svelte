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
	import { trytm } from '@bdsqqq/try'
	import Icon from '$components/shared/Icon.svelte'
	import Button from '$components/shared/buttons/Button.svelte'

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
	let saving = false

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
		saving = true

		const [_, err] = await trytm(service.save(data.id, [...$changes]))
		if (err) {
			Toast.error('Se presento un error al guardar la información del presupuesto')
		}

		saving = false
	}

	function beforeUnload(event: BeforeUnloadEvent) {
		if ($changes.length) {
			event.preventDefault()
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

<section class="flex justify-between mt-2 mx-2 md:mx-0">
	<Button
		value="Guardar"
		className="btn-primary"
		disabled={!saving && $changes.length == 0}
		loading={saving}
		outline
		on:click={handleSave}
	>
		<Icon>
			<path
				d="M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z"
			/>
		</Icon>
	</Button>
	<Button value="Salir" className="btn-primary" outline on:click={() => goto('/budget')}>
		<Icon>
			<path
				d="M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z"
			/>
		</Icon>
	</Button>
</section>

<section class="pt-0">
	<Tabs>
		<TabItem
			href={`/budget/${data.id}`}
			text="Resumen"
			active={$page.route.id === '/(app)/budget/[id]'}
		>
			<Icon>
				<path
					d="M14,17H7V15H14M17,13H7V11H17M17,9H7V7H17M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z"
				/>
			</Icon>
		</TabItem>
		<TabItem
			href={`/budget/${data.id}/details`}
			text="Detalle"
			active={$page.route.id?.includes('/(app)/budget/[id]/details') || false}
		>
			<Icon>
				<path
					d="M3 22V3H21V22L18 20L15 22L12 20L9 22L6 20L3 22M17 9V7H15V9H17M13 9V7H7V9H13M13 11H7V13H13V11M15 13H17V11H15V13Z"
				/>
			</Icon>
		</TabItem>
		<TabItem
			href={`/budget/${data.id}/statistics`}
			text="Estadísticas"
			active={$page.route.id === '/(app)/budget/[id]/statistics'}
		>
			<Icon>
				<path d="M2,2H4V20H22V22H2V2M7,10H17V13H7V10M11,15H21V18H11V15M6,4H22V8H20V6H8V8H6V4Z" />
			</Icon>
		</TabItem>
	</Tabs>

	<slot />
</section>
