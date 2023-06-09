<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { goto } from '$app/navigation'
	import { zeroPad } from '$utils/number.utils'
	import BaseCard from '../shared/BaseCard.svelte'
	import Stat from '../shared/Stat.svelte'
	import type { BudgetMinimal } from '$lib/types'
	import ButtonGroup from '../shared/buttons/ButtonGroup.svelte'
	import BaseButton from '../shared/buttons/BaseButton.svelte'

	export let loading: boolean
	export let project: BudgetMinimal

	let additionalName = `${zeroPad(project.month, 2)}/${project.year}`
	const dispatch = createEventDispatcher()

	async function handleEdit() {
		loading = true
		await goto(`/budget/${project.id}`)
		loading = false
	}

	function handleAction(action: 'delete' | 'clone') {
		dispatch(action)
	}
</script>

<BaseCard className="bg-gray-700">
	<header class="card-actions justify-end">
		<div class="tooltip tooltip-left" data-tip="Editar">
			<BaseButton value="" className="btn-square btn-sm bg-base-100" on:click={handleEdit}>
				<i class="bx bxs-edit-alt" />
			</BaseButton>
		</div>
	</header>

	<h2 class="card-title">
		{project.name}
		<div class="badge badge-xs badge-secondary">{additionalName}</div>
	</h2>

	<div class="stats shadow grid-col-3">
		<Stat title="Disponible" value={project.totalAvailableBalance}>
			<i class="bx bxs-wallet" />
		</Stat>
		<Stat title="Pendiente" value={project.totalPendingPayment}>
			<i class="bx bxs-shield-minus" />
		</Stat>
		<Stat title="Saldo" value={project.totalBalance}>
			<i class="bx bxs-dollar-circle" />
		</Stat>
	</div>

	<div class="indicator">
		<span class="indicator-item indicator-bottom badge badge-secondary">
			{project.pendingBills}
		</span>
		<span class="px-2 py-1 rounded bg-base-100">Pagos pendientes</span>
	</div>

	<footer class="card-actions justify-end mt-3">
		<div class="join">
			<ButtonGroup
				value="Borrar"
				className="btn-error rounded-l-full"
				on:click={() => handleAction('delete')}
			>
				<i class="bx bxs-trash-alt" />
			</ButtonGroup>
			<ButtonGroup
				value="Duplicar"
				className="btn-ghost rounded-r-full"
				on:click={() => handleAction('clone')}
			>
				<i class="bx bx-duplicate" />
			</ButtonGroup>
		</div>
	</footer>
</BaseCard>
