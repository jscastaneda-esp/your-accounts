<script lang="ts">
	import type { ProjectLog } from '$lib/types'
	import Toast from '$utils/toast.utils'
	import dayjs from '$utils/dayjs.utils'
	import { trpc } from '$lib/trpc/client'
	import Table from './Table.svelte'
	import { page } from '$app/stores'
	export let projectId: number

	const awaitLoad = [1, 2, 3, 4]
	const trpcF = trpc($page)
	let loading = false
	let logs: ProjectLog[] = []

	async function handleClick({ currentTarget }: { currentTarget: HTMLInputElement }) {
		if (currentTarget.checked) {
			loading = true
			try {
				logs = await trpcF.projects.getLogsByProjectId.query(projectId)
			} catch (error) {
				Toast.error('Se presento un error al consultar las transacciones', true)
				throw error
			} finally {
				loading = false
			}
		}
	}
</script>

<section class="px-4 pb-4">
	<div class="collapse collapse-plus bg-base-200">
		<input type="checkbox" class="peer" on:change={handleClick} />
		<div
			class="collapse-title bg-primary text-primary-content [input:checked~&]:bg-secondary [input:checked~&]:text-secondary-content"
		>
			<i class="bx bx-list-ul" />
			Registros
		</div>
		<div class="collapse-content bg-base-100">
			<Table>
				<tr slot="head">
					<th class="px-4">Fecha</th>
					<th class="px-4">Descripción</th>
				</tr>
				<svelte:fragment slot="body">
					{#if loading}
						{#each awaitLoad as _}
							<tr class="animate-pulse">
								<td><div class="bg-slate-400 h-5" /></td>
								<td><div class="bg-slate-400 h-5" /></td>
							</tr>
						{/each}
					{:else}
						{#each logs as transaction}
							<tr class="hover">
								<td>{dayjs(transaction.createdAt).fromNow()}</td>
								<td class="max-h-[26px] text-clip overflow-hidden">{transaction.description}</td>
							</tr>
						{:else}
							<tr>
								<td colspan="2" class="text-center">No se han registrado cambios</td>
							</tr>
						{/each}
					{/if}
				</svelte:fragment>
			</Table>
		</div>
	</div>
</section>
