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
	import Icon from '$components/shared/Icon.svelte'
	import Tooltip from '$components/shared/Tooltip.svelte'

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
		<Tooltip text="Editar" direction="left">
			<Button value="" className="btn-square btn-sm bg-base-100" on:click={handleEdit}>
				<Icon>
					<path
						d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"
					/>
				</Icon>
			</Button>
		</Tooltip>
	</header>

	<h2 class="card-title">
		{project.name}
		<div class="badge badge-xs badge-secondary">{additionalName}</div>
	</h2>

	<article class="stats shadow grid-col-3">
		<Stat title="Disponible" value={project.totalAvailable}>
			<Icon className="!h-6 !w-6">
				<path
					d="M21,18V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5A2,2 0 0,1 5,3H19A2,2 0 0,1 21,5V6H12C10.89,6 10,6.9 10,8V16A2,2 0 0,0 12,18M12,16H22V8H12M16,13.5A1.5,1.5 0 0,1 14.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,12A1.5,1.5 0 0,1 16,13.5Z"
				/>
			</Icon>
		</Stat>
		<Stat title="Pendiente" value={project.totalPending}>
			<Icon className="!h-6 !w-6">
				<path
					d="M3 22L4.5 20.5L6 22L7.5 20.5L9 22L10.58 20.42C10.72 20.61 10.88 20.78 11.05 20.95C12.36 22.26 14.14 23 16 23C19.86 23 23 19.87 23 16C23 14.17 22.28 12.41 21 11.1V2L19.5 3.5L18 2L16.5 3.5L15 2L13.5 3.5L12 2L10.5 3.5L9 2L7.5 3.5L6 2L4.5 3.5L3 2V22M20.85 16C20.85 16.64 20.73 17.27 20.5 17.86C20.24 18.44 19.88 19 19.43 19.43C19 19.88 18.44 20.24 17.86 20.5C17.27 20.73 16.64 20.85 16 20.85C13.32 20.85 11.15 18.68 11.15 16C11.15 14.71 11.66 13.5 12.57 12.57C13.5 11.66 14.71 11.15 16 11.15C18.67 11.15 20.85 13.32 20.85 16M15 16.69V13H16.5V15.82L18.94 17.23L18.19 18.53L15 16.69Z"
				/>
			</Icon>
		</Stat>
		<Stat title="Ahorro" value={project.totalAvailable - project.totalPending}>
			<Icon className="!h-6 !w-6">
				<path
					d="M4 8H2V2H4V8M2 22H4V16H2V22M3 10C1.9 10 1 10.9 1 12C1 13.11 1.9 14 3 14C4.11 14 5 13.11 5 12C5 10.9 4.11 10 3 10M24 6V18C24 19.11 23.11 20 22 20H10C8.9 20 8 19.11 8 18V14L6 12L8 10V6C8 4.89 8.9 4 10 4H22C23.11 4 24 4.89 24 6M19.75 10.33L18.59 8.92L15 12.5L13.41 10.92L12.25 12.08L15 15.08L19.75 10.33Z"
				/>
			</Icon>
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
			<ButtonGroup
				value="Duplicar"
				className="btn-secondary"
				on:click={() => handleAction('clone')}
			>
				<Icon>
					<path
						d="M11,17H4A2,2 0 0,1 2,15V3A2,2 0 0,1 4,1H16V3H4V15H11V13L15,16L11,19V17M19,21V7H8V13H6V7A2,2 0 0,1 8,5H19A2,2 0 0,1 21,7V21A2,2 0 0,1 19,23H8A2,2 0 0,1 6,21V19H8V21H19Z"
					/>
				</Icon>
			</ButtonGroup>
			<ButtonGroup value="Eliminar" className="btn-error" on:click={() => handleAction('delete')}>
				<Icon>
					<path
						d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"
					/>
				</Icon>
			</ButtonGroup>
		</section>
	</footer>
</Card>
