<script lang="ts">
	import type { ProjectLog } from '$lib/types'
	import Toast from '$utils/toast.utils'
	import dayjs from '$utils/dayjs.utils'
	import { page } from '$app/stores'
	import Logs from './Logs.svelte'
	import ProjectService from '$services/project.service'

	export let projectId: number

	const awaitLoad = [1, 2, 3, 4]
	const service = new ProjectService($page)

	let loading = false
	let logs: ProjectLog[] = []

	async function handleChange({ currentTarget }: Event) {
		const { checked } = currentTarget as HTMLInputElement
		if (checked) {
			loading = true
			try {
				logs = await service.getLogsByProjectId(projectId)
			} catch (error) {
				Toast.error('Se presento un error al consultar las transacciones', true)
			} finally {
				loading = false
			}
		}
	}
</script>

<section class="px-4 pb-4">
	<Logs background="bg-base-100" on:change={handleChange}>
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
				{#each logs as log}
					<tr class="hover">
						<td>{dayjs(log.createdAt).fromNow()}</td>
						<td class="max-h-[26px] text-clip overflow-hidden">{log.description}</td>
					</tr>
				{:else}
					<tr>
						<td colspan="2" class="text-center">No se han registrado cambios</td>
					</tr>
				{/each}
			{/if}
		</svelte:fragment>
	</Logs>
</section>
