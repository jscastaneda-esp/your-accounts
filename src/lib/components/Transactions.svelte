<script lang="ts">
	import { HttpStatus } from '../enums';
	import type { ProjectTransaction } from '../types';
	import Toast from '../utils/toast.utils';
	import dayjs from '../utils/dayjs.utils';
	import Card from './cards/Card.svelte';
	import HeaderCardSimple from './cards/HeaderCardSimple.svelte';

	export let projectId: number;

	const awaitLoad = [1, 2, 3, 4];
	let show = false;
	let loading = false;
	let transactions: ProjectTransaction[] = [];

	async function handleShow() {
		show = true;
		loading = true;
		try {
			const response = await fetch(`/api/logs?id=${projectId}`);
			if (response.status != HttpStatus.OK) {
				throw new Error(response.statusText);
			}

			transactions = await response.json();
		} catch (error) {
			Toast.error('Se presento un error al consultar las transacciones', true);
			throw error;
		} finally {
			loading = false;
		}
	}
</script>

<div class="relative">
	{#if show}
		<section class="absolute right-0 bottom-0 p-2 pb-3 w-full lg:w-1/2">
			<Card showBody>
				<HeaderCardSimple
					slot="header"
					title="Transacciones"
					iconHeader="list"
					iconAction="xmark"
					on:click={() => (show = false)}
				/>
				<table slot="body" class="w-full divide-y-2 divide-gray-200 text-sm">
					<thead>
						<tr class="grid grid-cols-[100px_1fr] py-2 text-left font-medium text-gray-900">
							<th class="px-4">Registrado</th>
							<th class="px-4">Descripción</th>
						</tr>
					</thead>
					<tbody
						class="divide-y divide-gray-200 inline-block overflow-y-auto min-h-[173px] h-[104px] w-full"
					>
						{#if loading}
							{#each awaitLoad as _}
								<tr class="grid grid-cols-[100px_1fr] animate-pulse h-[42px]">
									<td class="bg-slate-400 m-1" />
									<td class="bg-slate-400 m-1" />
								</tr>
							{/each}
						{:else}
							{#each transactions as transaction}
								<tr class="grid grid-cols-[100px_1fr] text-gray-900 py-2 text-left">
									<td class="px-4">{dayjs(transaction.createdAt).fromNow()}</td>
									<td class="px-4 max-h-[26px] text-clip overflow-hidden"
										>{transaction.description}</td
									>
								</tr>
							{:else}
								<tr class="grid justify-center p-4 font-semibold">
									<td colspan="2">No se han registrado transacciones</td>
								</tr>
							{/each}
						{/if}
					</tbody>
				</table>
			</Card>
		</section>
	{:else}
		<section class="absolute right-0 bottom-0 p-3">
			<button class="w-10 h-10 bg-blue-400 text-lg rounded-full" on:click={handleShow}>
				<i class="fa-solid fa-list" />
			</button>
		</section>
	{/if}
</div>
