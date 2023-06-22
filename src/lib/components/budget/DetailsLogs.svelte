<script lang="ts">
	import type { BudgetBillTransaction } from '$lib/types'
	import Toast from '$utils/toast.utils'
	import dayjs from '$utils/dayjs.utils'
	import { page } from '$app/stores'
	import { money } from '$utils/number.utils'
	import Logs from '$components/shared/logs/Logs.svelte'
	import BudgetBillService from '$lib/services/budget/budget-bill.service'

	export let billId: number

	const awaitLoad = [1, 2, 3, 4]
	const service = new BudgetBillService($page)

	let loading = false
	let transactions: BudgetBillTransaction[] = []

	async function handleChange({ currentTarget }: Event) {
		const { checked } = currentTarget as HTMLInputElement
		if (checked) {
			loading = true
			try {
				transactions = await service.getTransactionsById(billId)
			} catch (error) {
				Toast.error('Se presento un error al consultar las transacciones', true)
			} finally {
				loading = false
			}
		}
	}
</script>

<section class="md:col-span-2 lg:col-span-4 my-3">
	<Logs className="!max-h-44" on:change={handleChange}>
		<tr slot="head">
			<th class="px-4">Fecha</th>
			<th class="px-4">Descripción</th>
			<th class="px-4">Monto ($)</th>
		</tr>
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
						<td>{dayjs(transaction.createdAt).fromNow()}</td>
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
