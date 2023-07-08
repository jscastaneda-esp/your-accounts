<script lang="ts">
	import Table from '../Table.svelte'

	export let title = 'Registros'
	export let background = ''
	export let className = ''
</script>

<article class="collapse collapse-plus bg-base-200">
	<input type="checkbox" class="peer" on:change />
	<header
		class="collapse-title bg-primary text-primary-content [input:checked~&]:bg-secondary [input:checked~&]:text-secondary-content"
	>
		<i class="bx bx-list-ul" />
		{title}
	</header>
	<main class={`collapse-content p-0 ${background}`}>
		<Table {className}>
			<tr slot="head">
				<th class="px-4">Fecha</th>
				<th class="px-4">Descripción</th>
				<slot name="columns" />
			</tr>
			<svelte:fragment slot="body">
				<slot name="body" />
			</svelte:fragment>
		</Table>
	</main>
</article>
