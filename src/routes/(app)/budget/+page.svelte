<script lang="ts">
	// Utilities
	import { onMount } from 'svelte'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import Toast from '$utils/toast.utils'
	import { trpc } from '$lib/trpc/client'
	import dayjs from '$utils/dayjs.utils'

	// Components
	import CardBudget from '$components/budget/CardBudget.svelte'
	import ScreenLoading from '$components/shared/ScreenLoading.svelte'
	import ConfirmPopup from '$components/shared/popup/ConfirmPopup.svelte'
	import BaseCard from '$components/shared/BaseCard.svelte'
	import BaseButton from '$components/shared/buttons/BaseButton.svelte'

	// Types, Enums
	import type { BudgetMinimal } from '$lib/types'
	import ConfirmPopupInfo from '$lib/classes/ConfirmPopupInfo'

	const awaitLoad = [1, 2, 3, 4]
	let confirmPopupInfo = new ConfirmPopupInfo()
	confirmPopupInfo.actionCancel = () => {
		confirmPopupInfo = confirmPopupInfo.reset()
	}
	const trpcF = trpc($page)
	let loading = false
	let budgets: BudgetMinimal[]

	onMount(() => {
		getBudgets()
	})

	async function getBudgets() {
		try {
			budgets = await trpcF.budgets.getByUserId.query()
		} catch (error) {
			Toast.error('Se presento un error al consultar los proyectos', true)
			throw error
		}
	}

	async function handleNew() {
		loading = true

		try {
			const now = dayjs()
			const newProject = await trpcF.budgets.create.mutate({
				name: `Presupuesto ${now.month()}/${now.year()}`
			})
			await goto(`/budget/${newProject.id}`)
		} catch (error) {
			Toast.error('Se presento un error al crear el proyecto', true)
			throw error
		} finally {
			loading = false
		}
	}

	async function handleDelete(budget: BudgetMinimal) {
		confirmPopupInfo.show = true
		confirmPopupInfo.question = `¿Realmente desea eliminar el presupuesto ${budget.name}`
		confirmPopupInfo.description =
			'Se eliminará toda la información asociada y no será posible recuperarla'
		confirmPopupInfo.actionOk = async () => {
			loading = true

			try {
				await trpcF.budgets.delete.mutate(budget.id)
				Toast.success('Se elimino exitosamente el proyecto', true)
				budgets = budgets.filter((project) => project.id != budget.id)
			} catch (error) {
				Toast.error('Se presento un error al eliminar el proyecto', true)
				throw error
			} finally {
				loading = false
			}
		}
	}

	async function handleClone(budget: BudgetMinimal) {
		confirmPopupInfo.show = true
		confirmPopupInfo.question = `¿Realmente desea duplicar el presupuesto ${budget.name}?`
		confirmPopupInfo.description =
			'Se duplicará la información principal. Las transacciones no serán duplicadas'
		confirmPopupInfo.actionOk = async () => {
			loading = true

			try {
				const now = dayjs()
				const newProject = await trpcF.budgets.create.mutate({
					name: `Presupuesto ${now.month()}/${now.year()}`,
					cloneId: budget.id
				})
				await goto(`/budget/${newProject.id}`)
			} catch (error) {
				Toast.error('Se presento un error al duplicar el proyecto', true)
				throw error
			} finally {
				loading = false
			}
		}
	}
</script>

<svelte:head>
	<title>Presupuestos | Tus Cuentas</title>
</svelte:head>

<main class="p-6">
	{#if budgets}
		<BaseButton
			value="Crear presupuesto"
			className="btn-primary btn-block sm:btn-wide mb-6"
			on:click={() => handleNew()}
		>
			<i class="bx bxs-file-plus" />
		</BaseButton>
	{:else}
		<div class="animate-pulse btn btn-block sm:btn-wide mb-6 bg-slate-400" />
	{/if}

	<section
		class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 place-content-start_evenly gap-4"
	>
		{#if budgets}
			{#each budgets as project (project.id)}
				<CardBudget
					bind:loading
					{project}
					on:delete={() => handleDelete(project)}
					on:clone={() => handleClone(project)}
				/>
			{/each}
		{:else}
			{#each awaitLoad as _}
				<BaseCard className="bg-gray-700 animate-pulse">
					<header class="card-actions justify-end">
						<div class="btn-square bg-slate-400 h-7 w-7 rounded" />
					</header>
					<div class="card-title bg-slate-400 h-8" />
					<div class="stats shadow bg-slate-400 h-12 mt-1" />
					<div class="indicator mt-1">
						<div class="indicator-item indicator-bottom badge bg-slate-400 w-9" />
						<div class="h-7 w-32 rounded bg-slate-400" />
					</div>
					<footer class="card-actions justify-end mt-3">
						<div class="rounded-full bg-slate-400 w-56 h-8" />
					</footer>
				</BaseCard>
			{/each}
		{/if}
	</section>
</main>

{#if loading}
	<ScreenLoading />
{/if}

<ConfirmPopup id="budget" data={confirmPopupInfo} />
