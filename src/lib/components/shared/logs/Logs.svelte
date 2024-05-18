<script lang="ts">
	import { onMount } from 'svelte'
	import Table from '../Table.svelte'
	import { generateUniqueId } from '$utils/string.utils'
	import { browser } from '$app/environment'
	import Icon from '../Icon.svelte'

	export let title: string
	export let className = ''

	let id = 'drawer-logs'
	let checked = false

	onMount(() => {
		id = generateUniqueId(id)
	})

	$: if (browser) {
		if (checked) {
			document.body.classList.add('overflow-y-hidden')
		} else {
			document.body.classList.remove('overflow-y-hidden')
		}
	}
</script>

<article class="drawer drawer-end">
	<input {id} type="checkbox" class="drawer-toggle" bind:checked on:change />
	<div class="drawer-content">
		<label for={id} class="drawer-button btn btn-sm btn-secondary">
			<Icon>
				<path d="M9,5V9H21V5M9,19H21V15H9M9,14H21V10H9M4,9H8V5H4M4,19H8V15H4M4,14H8V10H4V14Z" />
			</Icon>
			{title}
		</label>
	</div>
	<main class="drawer-side z-[100]">
		<label for={id} aria-label="close sidebar" class="drawer-overlay"></label>
		<section
			class="w-80 sm:w-3/4 lg:w-[767px] min-h-full max-h-screen card bg-base-200 text-base-content rounded-none"
		>
			<article class="card-body">
				<h2 class="card-title">{title}</h2>
				<Table className={`${className} max-h-[calc(100vh-100px)] bg-base-300`}>
					<tr slot="head">
						<th class="px-4">Fecha</th>
						<th class="px-4">Descripción</th>
						<slot name="columns" />
					</tr>
					<svelte:fragment slot="body">
						<slot name="body" />
					</svelte:fragment>
				</Table>
			</article>
		</section>
	</main>
</article>
