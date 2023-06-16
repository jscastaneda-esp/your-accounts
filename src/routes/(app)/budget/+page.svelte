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
	import Card from '$components/shared/Card.svelte'
	import Button from '$components/shared/buttons/Button.svelte'

	// Types, Enums
	import type { BudgetMinimal } from '$lib/types'
	import { zeroPad } from '$utils/number.utils'
	import { screenLoading, confirmPopup } from '$lib/stores/shared'

	const awaitLoad = [1, 2, 3, 4]
	const trpcF = trpc($page)
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
		screenLoading.show()

		try {
			const now = dayjs()
			const newProject = await trpcF.budgets.create.mutate({
				name: `Presupuesto ${zeroPad(now.month(), 2)}/${now.year()}`
			})
			await goto(`/budget/${newProject.id}`)
		} catch (error) {
			Toast.error('Se presento un error al crear el proyecto', true)
			throw error
		} finally {
			screenLoading.hide()
		}
	}

	async function handleDelete(budget: BudgetMinimal) {
		confirmPopup.show(
			`¿Realmente desea eliminar el presupuesto ${budget.name}`,
			'Se eliminará toda la información asociada y no será posible recuperarla',
			async () => {
				screenLoading.show()

				try {
					await trpcF.budgets.delete.mutate(budget.id)
					Toast.success('Se elimino exitosamente el proyecto', true)
					budgets = budgets.filter((project) => project.id != budget.id)
				} catch (error) {
					Toast.error('Se presento un error al eliminar el proyecto', true)
					throw error
				} finally {
					screenLoading.hide()
				}
			}
		)
	}

	async function handleClone(budget: BudgetMinimal) {
		confirmPopup.show(
			`¿Realmente desea duplicar el presupuesto ${budget.name}?`,
			'Se duplicará la información principal. Las transacciones no serán duplicadas',
			async () => {
				screenLoading.show()

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
					screenLoading.hide()
				}
			}
		)
	}
</script>

<svelte:head>
	<title>Presupuestos | Tus Cuentas</title>
</svelte:head>

<main class="p-6">
	{#if budgets}
		<Button
			value="Crear presupuesto"
			className="btn-primary btn-block sm:btn-wide mb-6"
			on:click={() => handleNew()}
		>
			<i class="bx bxs-plus-square" />
		</Button>
	{:else}
		<div class="animate-pulse btn btn-block sm:btn-wide mb-6 bg-slate-400" />
	{/if}

	<section
		class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 place-content-start_evenly gap-4"
	>
		{#if budgets}
			{#each budgets as project (project.id)}
				<CardBudget
					{project}
					on:delete={() => handleDelete(project)}
					on:clone={() => handleClone(project)}
				/>
			{/each}
		{:else}
			{#each awaitLoad as _}
				<Card className="bg-gray-700 animate-pulse">
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
						<div class="rounded-btn bg-slate-400 w-56 h-8" />
					</footer>
				</Card>
			{/each}
		{/if}
	</section>
</main>
