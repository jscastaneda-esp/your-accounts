<script lang="ts">
	// Utilities
	import { onMount } from 'svelte'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import Toast from '$utils/toast.utils'
	import { trytm } from '@bdsqqq/try'

	// Components
	import CardBudget from '$components/budget/CardBudget.svelte'
	import Card from '$components/shared/Card.svelte'
	import Button from '$components/shared/buttons/Button.svelte'

	// Types, Enums
	import type { BudgetMinimal } from '$lib/types'
	import { screenLoading, confirmPopup } from '$lib/stores/shared'
	import BudgetService from '$services/budget/budget.service'

	const awaitLoad = [1, 2, 3, 4, 5, 6]
	const service = new BudgetService($page)
	let budgets: BudgetMinimal[]

	onMount(() => {
		service
			.getByUserId()
			.then((response) => (budgets = response))
			.catch(() => Toast.error('Se presento un error al consultar los proyectos'))
	})

	async function handleNew(cloneId?: number) {
		screenLoading.show()

		const [response, error] = await trytm(service.create(cloneId))
		if (error) {
			Toast.error(`Se presento un error al ${cloneId ? 'duplicar' : 'crear'} el proyecto`)
		} else {
			await trytm(goto(`/budget/${response.id}`))
		}

		screenLoading.hide()
	}

	async function handleClone(budget: BudgetMinimal) {
		confirmPopup.show(
			`¿Realmente desea duplicar el presupuesto ${budget.name}?`,
			'Se duplicará la información principal. Las transacciones no serán duplicadas',
			() => handleNew(budget.id)
		)
	}

	async function handleDelete(budget: BudgetMinimal) {
		confirmPopup.show(
			`¿Realmente desea eliminar el presupuesto ${budget.name}`,
			'Se eliminará toda la información asociada y no será posible recuperarla',
			async () => {
				screenLoading.show()

				const [_, error] = await trytm(service.delete(budget.id))
				if (error) {
					Toast.error('Se presento un error al eliminar el proyecto')
				} else {
					budgets = budgets.filter((project) => project.id != budget.id)
					Toast.success('Se elimino exitosamente el proyecto')
				}

				screenLoading.hide()
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
		<div class="skeleton btn btn-block sm:btn-wide mb-6 bg-slate-400 pointer-events-none" />
	{/if}

	<section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-content-start_evenly gap-4">
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
				<Card className="bg-gray-700 skeleton">
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
