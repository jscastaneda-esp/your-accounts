<script lang="ts">
	import type { Log } from '$lib/types'
	import Toast from '$utils/toast.utils'
	import { page } from '$app/stores'
	import { money } from '$utils/number.utils'
	import Logs from '$components/shared/logs/Logs.svelte'
	import { trytm } from '@bdsqqq/try'
	import { now, showLogDate } from '$utils/date.utils'
	import type { Dayjs } from 'dayjs'
	import LogService from '$services/log.service'
	import { CodeLogEnum } from '$lib/enums'

	export let billId: number

	const awaitLoad = [1, 2, 3, 4]
	const service = new LogService($page)

	let loading = false
	let transactions: Log[] = []
	let yesterday: Dayjs

	async function handleChange({ currentTarget }: Event) {
		const { checked } = currentTarget as HTMLInputElement
		if (checked) {
			loading = true
			const [result, error] = await trytm(
				service.getLogsByResourceId(billId, CodeLogEnum.BUDGET_BILL)
			)
			if (error) {
				Toast.error('Se presento un error al consultar las transacciones')
			} else {
				yesterday = now().subtract(1, 'day')
				transactions = result
			}
			loading = false
		}
	}
</script>

<Logs title="Movimientos" on:change={handleChange}>
	<svelte:fragment slot="columns">
		<th class="px-4">Monto ($)</th>
	</svelte:fragment>
	<svelte:fragment slot="body">
		{#if loading}
			{#each awaitLoad as _}
				<tr class="skeleton">
					<td><div class="bg-slate-400 h-5" /></td>
					<td><div class="bg-slate-400 h-5" /></td>
					<td><div class="bg-slate-400 h-5" /></td>
				</tr>
			{/each}
		{:else}
			{#each transactions as transaction}
				<tr class="hover">
					<td>{showLogDate(yesterday, transaction.createdAt)}</td>
					<td class="max-h-[26px] text-clip overflow-hidden">{transaction.description}</td>
					<td>
						{#if transaction.detail}
							<div
								class="badge gap-1"
								class:badge-success={Number(transaction.detail.amount) > 0}
								class:badge-error={Number(transaction.detail.amount) < 0}
							>
								{#if Number(transaction.detail.amount) > 0}
									<span>↗︎</span>
								{:else}
									<span>↘︎</span>
								{/if}
								{money(Number(transaction.detail.amount))}
							</div>
						{/if}
					</td>
				</tr>
			{:else}
				<tr>
					<td colspan="3" class="text-center">No se han registrado cambios</td>
				</tr>
			{/each}
		{/if}
	</svelte:fragment>
</Logs>
