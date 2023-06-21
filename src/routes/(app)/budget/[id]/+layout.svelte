<script lang="ts">
	// Enums, Types, Utilities
	import { onDestroy, onMount, setContext } from 'svelte'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import { confirmPopup } from '$lib/stores/shared'
	import { changesStore } from '$lib/stores/changes'
	import { availablesStore, billsDataStore, resumeStore } from '$lib/stores/budget'
	import { ChangeActionEnum, ChangeSectionEnum, ContextNameEnum } from '$lib/enums'
	import type { Budget, Change } from '$lib/types'
	import { trpc } from '$lib/trpc/client'
	import { groupBy } from '$utils/array.utils'
	import Toast from '$utils/toast.utils'
	import { zeroPad } from '$utils/number.utils'

	// Components
	import Navbar from '$components/shared/navbar/Navbar.svelte'
	import NavbarItem from '$components/shared/navbar/NavbarItem.svelte'
	import ButtonLink from '$components/shared/buttons/ButtonLink.svelte'

	export let data: Budget

	const trpcF = trpc($page)

	let interval: ReturnType<typeof setInterval>

	onMount(() => {
		interval = setInterval(() => {
			handleSave()
		}, 30000)
	})

	onDestroy(() => {
		clearInterval(interval)
	})

	const changes = changesStore()
	setContext(ContextNameEnum.CHANGES, {
		changes
	})

	const { month } = resumeStore(`${data.year}-${zeroPad(data.month, 2)}`)
	setContext(ContextNameEnum.BUDGET_RESUME, {
		month
	})

	const { totalAvailable } = availablesStore(
		data.availableBalances.reduce((previous, current) => previous + current.amount, 0)
	)
	setContext(ContextNameEnum.BUDGET_AVAILABLES, {
		totalAvailable
	})

	const { bills, totals, statistics } = billsDataStore(data.bills)
	setContext(ContextNameEnum.BUDGET_BILLS, {
		bills,
		totals,
		statistics
	})

	async function handleSave() {
		const changeList = [...$changes]
		if (changeList.length > 0) {
			try {
				changes.delete(changeList)
				const sendChanges: Change<unknown>[] = []

				const groupBySection = groupBy(changeList, (change) => change.section)
				Object.entries(groupBySection).forEach((group) => {
					const [section, items] = group
					const groupByAction = groupBy(items, (change) => change.action)
					Object.entries(groupByAction).forEach((group) => {
						const [action, items] = group
						const groupById = groupBy(items, (change) => change.detail.id.toString())
						Object.entries(groupById).forEach((group) => {
							const [id, items] = group

							const sendChange: Change<unknown> = {
								section: section as ChangeSectionEnum,
								action: action as ChangeActionEnum,
								detail: {
									id: Number(id)
								}
							}

							items.forEach(
								(item) => (sendChange.detail = { ...sendChange.detail, ...item.detail })
							)
							sendChanges.push(sendChange)
						})
					})
				})

				await trpcF.projects.receiveChanges.mutate({
					projectId: data.projectId,
					changes: sendChanges
				})
			} catch (error) {
				changes.revert(changeList)
				Toast.error('Se presento un error al guardar', true)
				throw error
			}
		}
	}

	function handleExit() {
		confirmPopup.show(
			'¿Realmente desea salir?',
			'Al salir se pueden perder cambios. Se recomienda primero guardar',
			() => goto('/budget')
		)
	}
</script>

<main class="w-full">
	<section class="flex justify-between">
		<ButtonLink value="Guardar" disabled={$changes.length == 0} on:click={handleSave}>
			<i class="bx bxs-save" />
		</ButtonLink>
		<ButtonLink value="Salir" on:click={handleExit}>
			<i class="bx bx-arrow-back" />
		</ButtonLink>
	</section>

	<section class="p-2 bg-base-200">
		<Navbar>
			<NavbarItem
				href={`/budget/${data.id}`}
				active={$page.route.id === '/(app)/budget/[id]'}
				text="Resumen"
			>
				<i class="bx bxs-detail" />
			</NavbarItem>
			<NavbarItem
				href={`/budget/${data.id}/details`}
				active={$page.route.id?.includes('/(app)/budget/[id]/details') || false}
				text="Detalle"
			>
				<i class="bx bxs-dollar-circle" />
			</NavbarItem>
			<NavbarItem
				href={`/budget/${data.id}/statistics`}
				active={$page.route.id === '/(app)/budget/[id]/statistics'}
				text="Estadísticas"
			>
				<i class="bx bxs-bar-chart-alt-2" />
			</NavbarItem>
		</Navbar>

		<div class="divider -mt-1 -mb-1" />

		<slot />
	</section>
</main>
