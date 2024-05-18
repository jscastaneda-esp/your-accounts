<script lang="ts">
	import { money } from '$utils/number.utils'

	export let title: string
	export let value: number
	export let desc: string | null = null
	export let className = ''
	export let classDescName = ''
</script>

<article class={`stat p-3 text-base ${className}`}>
	<figure class="stat-figure text-primary">
		<slot />
	</figure>
	<header class="stat-title">{title}</header>
	<main class="stat-value">{money(value)}</main>
	{#if desc}
		<footer class={`stat-desc ${classDescName}`}>{desc}</footer>
	{/if}
	{#if $$slots.actions}
		<footer class="stat-actions mt-2">
			<slot name="actions" />
		</footer>
	{/if}
</article>

<style>
	.stat .stat-figure {
		font-size: 1.5em;
		line-height: 1.75rem;
	}

	.stat :where(.stat-title, .stat-value) {
		font-size: 0.75em;
		line-height: 1em;
	}

	.stat .stat-desc {
		font-size: 0.6em;
		line-height: 1em;
	}
</style>
