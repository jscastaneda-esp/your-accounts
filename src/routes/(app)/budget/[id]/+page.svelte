<script lang="ts">
	// Enums, Types, Utilities
	import { onDestroy, onMount, setContext } from 'svelte'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import type { Budget, Change } from '$lib/types'
	import Toast from '$utils/toast.utils'
	import { ChangeActionEnum, ChangeSectionEnum, ContextNameEnum } from '$lib/enums'
	import { groupBy } from '$utils/array.utils'
	import { changes } from '$lib/stores'
	import ConfirmPopupInfo from '$lib/classes/ConfirmPopupInfo'
	import { trpc } from '$lib/trpc/client'

	// Components
	import ButtonLink from '$components/shared/buttons/ButtonLink.svelte'
	import ScreenLoading from '$components/shared/ScreenLoading.svelte'
	import ConfirmPopup from '$components/shared/popup/ConfirmPopup.svelte'
	import Resume from '$components/budget/Resume.svelte'
	import Logs from '$components/old/Logs.svelte'
	import Navbar from '$components/budget/Navbar.svelte'
	// import CardBudgetAvailable from '$components/cards/budget/CardBudgetAvailable.svelte'
	// import CardBudgetBills from '$components/cards/budget/CardBudgetBills.svelte'
	// import CardBudgetStatistics from '$components/cards/budget/CardBudgetStatistics.svelte'

	export let data: Budget

	let tab = 1
	let loading = false
	let interval: ReturnType<typeof setInterval>
	let totalAvailable = 0
	let totalPending = 0
	let totalPayment = 0
	let totalMaxPayment = 0
	let totalSavings = 0
	const confirmPopupInfo = new ConfirmPopupInfo(
		false,
		'¿Realmente desea salir?',
		'Al salir se pueden perder cambios. Se recomienda primero guardar'
	)
	confirmPopupInfo.actionCancel = () => {
		confirmPopupInfo.show = false
	}
	const trpcF = trpc($page)

	onMount(() => {
		interval = setInterval(() => {
			handleSave()
		}, 30000)
	})

	onDestroy(() => {
		clearInterval(interval)
	})

	setContext(ContextNameEnum.CHANGES, {
		changes
	})

	async function handleSave() {
		const changeList = [...$changes]
		if ($changes.length > 0) {
			try {
				changes.delete(changeList)
				const sendChanges: Change<Record<string, unknown>>[] = []

				const groupBySection = groupBy<Change<Record<string, unknown>>>(
					changeList,
					(change) => change.section
				)
				Object.entries(groupBySection).forEach((group) => {
					const [section, items] = group
					const groupByAction = groupBy<Change<Record<string, unknown>>>(
						items,
						(change) => change.action
					)
					Object.entries(groupByAction).forEach((group) => {
						const [action, items] = group
						const groupById = groupBy<Change<Record<string, unknown>>>(items, (change) =>
							change.detail.id.toString()
						)
						Object.entries(groupById).forEach((group) => {
							const [id, items] = group

							const sendChange: Change<Record<string, unknown>> = {
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
					projectId: 1,
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
		confirmPopupInfo.show = true
		confirmPopupInfo.actionOk = async () => {
			loading = true
			try {
				await goto('/budget')
			} finally {
				loading = false
			}
		}
	}

	$: {
		const url = $page.url.toString()
		if (url.endsWith('#register')) tab = 2
		else if (url.endsWith('#report')) tab = 3
		else tab = 1
	}
	$: data.estimatedBalance = data.fixedIncome + data.additionalIncome - data.total
	$: data.totalBalance = totalAvailable - totalPending
</script>

<svelte:head>
	<title>Presupuesto | Tus Cuentas</title>
</svelte:head>

<main class="w-full">
	<section class="flex justify-between">
		<ButtonLink value="Guardar" disabled={$changes.length == 0} on:click={handleSave}>
			<i class="bx bxs-save" />
		</ButtonLink>
		<ButtonLink value="Salir" on:click={handleExit}>
			<i class="bx bx-arrow-back" />
		</ButtonLink>
	</section>

	<!-- svelte-ignore a11y-missing-attribute -->
	<section class="p-2">
		<Navbar {tab} />

		<section class="mt-1 bg-base-200 rounded-btn">
			{#if tab == 1}
				<Resume {data} {totalPayment} {totalMaxPayment} {totalSavings} />
			{:else if tab == 2}
				<h1>Registro de Datos</h1>
			{:else if tab == 3}
				<h1>Estadísticas</h1>
			{/if}
		</section>
	</section>
</main>

<!-- <article class="px-2 py-3 flex flex-col gap-[10px] mb-[5.2rem] md:mb-[7.6rem]">
	<section class="grid grid-cols-[repeat(auto-fit,_minmax(294px,_1fr))] gap-[10px]">
		<CardBudgetAvailable
			bind:isValidForm={isValidAvailable}
			bind:loading
			bind:total={totalAvailable}
			budgetId={data.id}
			list={data.availableBalances}
		/>
		<CardBudgetBills
			bind:isValidForm={isValidBills}
			bind:loading
			bind:total={data.total}
			bind:totalPending={totalBillPending}
			bind:totalMaxPayment={totalBillMaxPayment}
			bind:totalSavings={totalBillSavings}
			budgetId={data.id}
			budgetMonth={$dataForm.month}
			list={data.bills}
		/>
	</section>
	<CardBudgetStatistics budgetId={data.id} />
</article> -->

<Logs projectId={data.projectId} />

{#if loading}
	<ScreenLoading />
{/if}

<ConfirmPopup id={`budget_${data.id}`} data={confirmPopupInfo} />
