<script lang="ts">
	import type { ProjectLog } from '$lib/types'
	import Toast from '$utils/toast.utils'
	import { page } from '$app/stores'
	import Logs from './Logs.svelte'
	import ProjectService from '$services/project.service'
	import { trytm } from '@bdsqqq/try'
	import type { Dayjs } from 'dayjs'
	import { now, showLogDate } from '$utils/date.utils'

	export let projectId: number

	const awaitLoad = [1, 2, 3, 4]
	const service = new ProjectService($page)

	let loading = false
	let logs: ProjectLog[] = []
	let yesterday: Dayjs

	async function handleChange({ currentTarget }: Event) {
		const { checked } = currentTarget as HTMLInputElement
		if (checked) {
			loading = true

			const [result, error] = await trytm(service.getLogsByProjectId(projectId))
			if (error) {
				Toast.error('Se presento un error al consultar las registros', true)
			} else {
				yesterday = now().subtract(1, 'day')
				logs = result
			}

			loading = false
		}
	}
</script>

<section class="px-4 pb-4">
	<Logs background="bg-base-100" on:change={handleChange}>
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
						<td>{showLogDate(yesterday, log.createdAt)}</td>
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
