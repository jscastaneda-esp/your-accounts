<script lang="ts">
	import type { BudgetBillTransaction } from '$lib/types'
	import Toast from '$utils/toast.utils'
	import { page } from '$app/stores'
	import { money } from '$utils/number.utils'
	import Logs from '$components/shared/logs/Logs.svelte'
	import BudgetBillService from '$services/budget/budget-bill.service'
	import { trytm } from '@bdsqqq/try'
	import { now, showLogDate } from '$utils/date.utils'
	import type { Dayjs } from 'dayjs'

	export let billId: number

	const awaitLoad = [1, 2, 3, 4]
	const service = new BudgetBillService($page)

	let loading = false
	let transactions: BudgetBillTransaction[] = []
	let yesterday: Dayjs

	async function handleChange({ currentTarget }: Event) {
		const { checked } = currentTarget as HTMLInputElement
		if (checked) {
			loading = true
			const [result, error] = await trytm(service.getTransactionsById(billId))
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

<section class="md:col-span-2 lg:col-span-4 my-3">
	<Logs title="Movimientos" className="!max-h-44" background="bg-base-100" on:change={handleChange}>
		<svelte:fragment slot="columns">
			<th class="px-4">Monto ($)</th>
		</svelte:fragment>
		<svelte:fragment slot="body">
			{#if loading}
				{#each awaitLoad as _}
					<tr class="animate-pulse">
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
							<div
								class="badge gap-1"
								class:badge-success={transaction.amount > 0}
								class:badge-error={transaction.amount < 0}
							>
								{#if transaction.amount > 0}
									<span>↗︎</span>
								{:else}
									<span>↘︎</span>
								{/if}
								{money(transaction.amount)}
							</div>
						</td>
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
