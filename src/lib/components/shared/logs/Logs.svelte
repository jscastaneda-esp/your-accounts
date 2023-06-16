<script lang="ts">
	import Table from '../Table.svelte'

	export let background = ''
	export let className = ''
</script>

<article class="collapse collapse-plus bg-base-200">
	<input type="checkbox" class="peer" on:change />
	<header
		class="collapse-title bg-primary text-primary-content [input:checked~&]:bg-secondary [input:checked~&]:text-secondary-content"
	>
		<i class="bx bx-list-ul" />
		Registros
	</header>
	<main class={`collapse-content p-0 ${background}`}>
		<Table {className}>
			<svelte:fragment slot="head">
				<slot name="head" />
			</svelte:fragment>
			<svelte:fragment slot="body">
				<slot name="body" />
			</svelte:fragment>
		</Table>
	</main>
</article>
