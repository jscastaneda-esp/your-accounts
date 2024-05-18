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
	import Icon from '$components/shared/Icon.svelte'

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

<section class="mx-2 my-6">
	{#if budgets}
		<Button
			value="Nuevo presupuesto"
			className="btn-primary btn-block sm:btn-wide mb-3"
			on:click={() => handleNew()}
		>
			<Icon>
				<path
					d="M12.35 20H10V17H12.09C12.21 16.28 12.46 15.61 12.81 15H10V12H14V13.54C14.58 13 15.25 12.61 16 12.35V12H20V12.35C20.75 12.61 21.42 13 22 13.54V5C22 3.9 21.1 3 20 3H4C2.9 3 2 3.9 2 5V20C2 21.1 2.9 22 4 22H13.54C13 21.42 12.61 20.75 12.35 20M16 7H20V10H16V7M10 7H14V10H10V7M8 20H4V17H8V20M8 15H4V12H8V15M8 10H4V7H8V10M17 14H19V17H22V19H19V22H17V19H14V17H17V14"
				/>
			</Icon>
		</Button>
	{:else}
		<div class="skeleton btn btn-block sm:btn-wide mb-6 bg-slate-400 pointer-events-none" />
	{/if}

	<article class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-content-start_evenly gap-4">
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
	</article>
</section>
