<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { goto } from '$app/navigation'
	import { zeroPad } from '$utils/number.utils'
	import Card from '../shared/Card.svelte'
	import Stat from '../shared/Stat.svelte'
	import type { BudgetMinimal } from '$lib/types'
	import ButtonGroup from '../shared/buttons/ButtonGroup.svelte'
	import Button from '../shared/buttons/Button.svelte'
	import { screenLoading } from '$lib/stores/shared'

	export let project: BudgetMinimal

	let additionalName = `${zeroPad(project.month, 2)}/${project.year}`
	const dispatch = createEventDispatcher()

	async function handleEdit() {
		screenLoading.show()
		await goto(`/budget/${project.id}`)
		screenLoading.hide()
	}

	function handleAction(action: 'delete' | 'clone') {
		dispatch(action)
	}
</script>

<Card className="bg-gray-700">
	<header class="card-actions justify-end">
		<div class="tooltip tooltip-left" data-tip="Editar">
			<Button value="" className="btn-square btn-sm bg-base-100" on:click={handleEdit}>
				<i class="bx bxs-edit-alt" />
			</Button>
		</div>
	</header>

	<h2 class="card-title">
		{project.name}
		<div class="badge badge-xs badge-secondary">{additionalName}</div>
	</h2>

	<article class="stats shadow grid-col-3">
		<Stat title="Disponible" value={project.totalAvailable}>
			<i class="bx bxs-wallet" />
		</Stat>
		<Stat title="Pendiente" value={project.totalPending}>
			<i class="bx bxs-timer" />
		</Stat>
		<Stat title="Ahorro" value={project.totalSaving}>
			<i class="bx bxs-coin-stack" />
		</Stat>
	</article>

	<section class="indicator">
		<span class="indicator-item indicator-bottom badge badge-secondary">
			{project.pendingBills}
		</span>
		<span class="px-2 py-1 rounded bg-base-100">Pagos pendientes</span>
	</section>

	<footer class="card-actions justify-end mt-3">
		<section class="join">
			<ButtonGroup value="Eliminar" className="btn-error" on:click={() => handleAction('delete')}>
				<i class="bx bxs-trash-alt" />
			</ButtonGroup>
			<ButtonGroup value="Duplicar" className="btn-ghost" on:click={() => handleAction('clone')}>
				<i class="bx bx-duplicate" />
			</ButtonGroup>
		</section>
	</footer>
</Card>
