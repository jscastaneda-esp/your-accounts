<script lang="ts">
	import CardBudget from './CardBudget.svelte';
	import SimpleHeaderCardBudget from './SimpleHeaderCardBudget.svelte';

	let show = false;
</script>

{#if show}
	<section class="flex justify-end p-2 pb-3">
		<CardBudget classNameContainer="md:max-w-[50%]" showBody={true}>
			<SimpleHeaderCardBudget
				slot="header"
				title="Transacciones"
				iconHeader="list"
				iconAction="xmark"
				on:click={() => (show = false)}
			/>
			<table slot="body" class="w-full divide-y-2 divide-gray-200 text-sm">
				<thead>
					<tr class="grid grid-cols-[100px_1fr]">
						<th class="px-4 py-2 text-left font-medium text-gray-900">Fecha</th>
						<th class="px-4 py-2 text-left font-medium text-gray-900">Descripción</th>
					</tr>
				</thead>
				<tbody
					class="divide-y divide-gray-200 inline-block overflow-y-auto min-h-[104px] h-[104px]"
				>
					<tr class="grid grid-cols-[100px_1fr]">
						<td class="px-4 py-2 text-gray-900">26/08/2022</td>
						<td class="px-4 py-2 text-gray-700 max-h-[50px] text-clip overflow-hidden">
							Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur explicabo
							aliquid perferendis maxime illo dolorem distinctio repudiandae itaque rem voluptatum,
							earum maiores animi soluta voluptates autem consectetur, modi aspernatur nihil.
						</td>
					</tr>
					<tr class="grid grid-cols-[100px_1fr]">
						<td class="px-4 py-2 text-gray-900">26/08/2022</td>
						<td class="px-4 py-2 text-gray-700 max-h-[50px] text-clip overflow-hidden"
							>Se agrage nuevo gasto por un valor de $100,000
						</td>
					</tr>
					<tr class="grid grid-cols-[100px_1fr]">
						<td class="px-4 py-2 text-gray-900">26/08/2022</td>
						<td class="px-4 py-2 text-gray-700 max-h-[50px] text-clip overflow-hidden"
							>Se agrage nuevo gasto por un valor de $100,000
						</td>
					</tr>
					<tr class="grid grid-cols-[100px_1fr]">
						<td class="px-4 py-2 text-gray-900">26/08/2022</td>
						<td class="px-4 py-2 text-gray-700 max-h-[50px] text-clip overflow-hidden"
							>Se agrage nuevo gasto por un valor de $100,000
						</td>
					</tr>
				</tbody>
			</table>
		</CardBudget>
	</section>
{:else}
	<section class="flex justify-end p-3">
		<button class="w-10 h-10 bg-blue-400 text-lg rounded-full" on:click={() => (show = true)}>
			<i class="fa-solid fa-list" />
		</button>
	</section>
{/if}
