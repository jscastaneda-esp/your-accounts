<script lang="ts">
	import { money } from '$lib/utils/numberFormat.utils';

	let tab = 2;
</script>

<article class="bg-white w-full max-w-md shadow-sm shadow-gray-400 rounded-lg transition-all mb-1">
	<ul class="grid grid-cols-2 border-b-2 border-gray-200 text-gray-500">
		<li>
			<a class="relative block py-1.5 px-4" href="#add" on:click={() => (tab = 1)}>
				<span
					class="absolute inset-x-0 -bottom-[2px] h-[2px] w-full transition-colors ease-in-out"
					class:bg-blue-400={tab == 1}
				/>

				<div class="flex items-center justify-center gap-3 font-semibold">
					<i class="fa-solid fa-plus" />
					<span class="text-sm">Agregar</span>
				</div>
			</a>
		</li>
		<li>
			<a class="relative block py-1.5 px-4" href="#transactions" on:click={() => (tab = 2)}>
				<div class="flex items-center justify-center gap-3 font-semibold">
					<span
						class="absolute inset-x-0 -bottom-[2px] h-[2px] w-full transition-colors ease-in-out"
						class:bg-blue-400={tab == 2}
					/>
					<i class="fa-solid fa-list" />
					<span class="text-sm">Movimientos</span>
				</div>
			</a>
		</li>
	</ul>
	{#if tab == 1}
		<section id="add">Add</section>
	{/if}
	{#if tab == 2}
		<section id="transactions" class="w-full">
			<table class="w-full divide-y-2 divide-gray-200 text-sm">
				<thead>
					<tr class="grid grid-cols-[100px_1fr_120px] py-2 text-left font-medium text-gray-900">
						<th class="px-4">Fecha</th>
						<th class="px-4">Descripción</th>
						<th class="px-4">Monto</th>
					</tr>
				</thead>
				<tbody
					class="divide-y divide-gray-200 inline-block overflow-y-auto min-h-[130px] h-[130px] w-full"
				>
					<tr class="grid grid-cols-[100px_1fr_120px] text-gray-900 py-2">
						<td class="px-4">26/08/2022</td>
						<td class="px-4 max-h-[26px] text-clip overflow-hidden"> Compra número 1 </td>
						<td class="px-4">
							<strong
								class="w-full inline-block text-center rounded py-1 text-xs font-medium bg-green-100 text-green-700"
							>
								{money(10000)}
							</strong>
						</td>
					</tr>
					<tr class="grid grid-cols-[100px_1fr_120px] text-gray-900 py-2">
						<td class="px-4">26/08/2022</td>
						<td class="px-4 max-h-[26px] text-clip overflow-hidden"> Compra número 2 </td>
						<td class="px-4">
							<strong
								class="w-full inline-block text-center rounded py-1 text-xs font-medium bg-red-100 text-red-700"
							>
								{money(-5000)}
							</strong>
						</td>
					</tr>
					<tr class="grid grid-cols-[100px_1fr_120px] text-gray-900 py-2">
						<td class="px-4">26/08/2022</td>
						<td class="px-4 max-h-[26px] text-clip overflow-hidden"> Compra número 3 </td>
						<td class="px-4">
							<strong
								class="w-full inline-block text-center rounded py-1 text-xs font-medium bg-green-100 text-green-700"
							>
								{money(100000)}
							</strong>
						</td>
					</tr>
					<tr class="grid grid-cols-[100px_1fr_120px] text-gray-900 py-2">
						<td class="px-4">26/08/2022</td>
						<td class="px-4 max-h-[26px] text-clip overflow-hidden"> Compra número 4 </td>
						<td class="px-4">
							<strong
								class="w-full inline-block text-center rounded py-1 text-xs font-medium bg-red-100 text-red-700"
							>
								{money(-1000000)}
							</strong>
						</td>
					</tr>
				</tbody>
			</table>
		</section>
	{/if}
</article>
